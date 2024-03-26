"use client"

import React from "react";
import { useAtom } from "jotai";
import { ethers } from 'ethers';
import axios from 'axios';
import { useRouter } from "next/navigation";
import useNotification from "@/hooks/useNotification";
import { LIQUIDITY } from '@/utils/constants';
//for cosmos
import {
  defaultRegistryTypes as defaultStargateTypes,
  SigningStargateClient,
} from "@cosmjs/stargate";
import {
  DirectSecp256k1HdWallet,
  Registry,
} from "@cosmjs/proto-signing";
//atoms
import {
  isConnectingAtom,
  chainListAtom,
  xBalancesAtom,
  xDefiAddressesAtom,
  isWalletDetectedAtom,
  QuoteSwapResponseAtom,
  fromTokenAtom,
  toTokenAtom,
  showTrxModalAtom,
  trxUrlAtom
} from "@/store";
//types
import { ChainType, XBalances, IBalance, IWallet } from "@/types/minis";
import { IPool, IParamsWithdrawLiquidity, IParamsAddLPAsset, IParamsAddLPCACAO } from "@/types/maya";
//data
import { ERC_20_ADDRESSES, EVM_ROUTER_ADDRESS, ERC20_DECIMALS, TOKEN_DATA, MINIMUM_AMOUNT } from "@/utils/data";
//abis
import USDT_ABI from '@/utils/ABIs/usdt.json';
import EVM_ROUTER_ABI from '@/utils/ABIs/evmRouter.json';
import ERC20_ABI from "@/utils/ABIs/erc20.json";
//context type
interface IXDefiContext {
  connectToXDefi: () => Promise<void>,
  getBalancesWithXDefi: () => Promise<void>,
  doXDefiSwap: (amount: number | string) => Promise<any>,

  xDefiAddLPAsset: ({ asset, decimals, amount, recipient, mayaAddress, mode }: IParamsAddLPAsset) => Promise<string>,
  /**
   * tranfer asset for adding liquidty
   * @param param0 IParamsAddLPCacao
   * @returns tx hash
   */
  xDefiAddLPCACAO: ({ amount, address }: IParamsAddLPCACAO) => Promise<string>,
  /**
   * transfer token using xchainjs
   * @param asset string "ETH.ETH"
   * @param decimals number 18
   * @param bps string 10000
   * @param recipient string 0x01012050123123....
   * @param address string current asset's address
   * @param mayaAddress string maya12351231
   * @param mode string LIQUIDITY.SYM | LIQUIDITY.ASYM
   * @returns { hash, url }[] | undefined
   */
  xDefiWithdrawLiquidity: ({ asset, decimals, bps, recipient, address, mayaAddress, mode }: IParamsWithdrawLiquidity) => Promise<any>
}
//prices methods
import { _getPrices } from "./XChainContext";
import { IQuoteSwapResponse, IParamsAddLiquidity } from "@/types/maya";
//msg type
import { types } from "@/types/proto/MsgCompiled";
//minis
const bech32 = require("bech32-buffer");
/**
 * XDefiContext
*/
export const XDefiContext = React.createContext<IXDefiContext | undefined>(undefined);
/**
 * 
 * @param _amount amount to swap
 * @param _from my address
 * @param _memo memo for swap "=:MAYA.CACAO..."
 * @param _recipient inbound address
 * @param _signer provider signer
 * @returns 
 */
export const _sendEther: any = async (_amount: number, _from: string, _memo: string, _recipient: string, _signer: any) => {
  try {
    console.log("@swap ETH ------------------------", { memo: _memo, amount:_amount, recipient: _recipient, from: _from });
    // const memo = ethers.utils.toUtf8Bytes(_quoteSwap.memo);
    const recipient = _recipient;
    const memo = _memo;
    const amount = ethers.utils.parseEther(String(_amount));
    const expiration = (await _signer.provider.getBlock("latest")).timestamp + 60*60;

    const Contract = new ethers.Contract(EVM_ROUTER_ADDRESS, EVM_ROUTER_ABI, _signer);
    const tx = await Contract.depositWithExpiry(recipient, ERC_20_ADDRESSES["ETH"], amount, memo, expiration, { from: _from, value: amount });

    console.log("Swap ETH with Metamask transaction ------------------", tx);
    return Promise.resolve(tx);
  } catch (err) {
    //@ts-ignore
    if (err.code && err.code === 4001) { //user rejected....
      return Promise.reject("Rejected the operation.");
    } else {
      return Promise.reject(err);
    }
  }
}
/**
 * transfer ERC20 token to another address with memo
 * @param _amount token amount to swap
 * @param _from my address
 * @param _memo memo for swap
 * @param _recipient inbound address
 * @param _signer provider signer
 * @param _symbol token symbol ETH.USDC, ETH.USDT, ETH.WETH
 * @returns 
 */
// export const _depositERC20Token = async (_amount: number, _from: string, _quoteSwap: IQuoteSwapResponse, _signer: any, _symbol: string) => {
export const _depositERC20Token = async (_amount: number, _from: string, _memo: string, _recipient: string, _signer: any, _symbol: string) => {
  try {
    console.log("@ERC20 swap -----------------------", { symbol: _symbol, memo: _memo, _amount, recipient: _recipient, contract_address: ERC_20_ADDRESSES[_symbol] });

    const recipient = _recipient;
    const memo = _memo;
    const { gasLimit, timestamp } = await _signer.provider.getBlock('latest');
    const expiration = timestamp + 60*60;
    const gasPrice = await _signer.provider.getGasPrice();
    // const amount = ethers.utils.parseUnits(String(_amount), ERC20_DECIMALS[_symbol]);
    const amount = Math.floor(_amount / 10 ** ERC20_DECIMALS[_symbol]);
    console.log(ERC_20_ADDRESSES[_symbol], _amount, memo, expiration);
    
    const Contract_ERC20 = new ethers.Contract(ERC_20_ADDRESSES[_symbol], ERC20_ABI, _signer);
    const tx = await Contract_ERC20.approve(EVM_ROUTER_ADDRESS, amount, { gasLimit: 80000 });
    await tx.wait();
    //depositWithExpiry(address vault,address asset,uint256 amount,string memo,uint256 expiration)
    const Contract = new ethers.Contract(EVM_ROUTER_ADDRESS, EVM_ROUTER_ABI, _signer);
    const data = await Contract.depositWithExpiry(recipient, ERC_20_ADDRESSES[_symbol], amount, memo, expiration);

    return Promise.resolve(data);
  } catch (err) {
    console.log(err)
    //@ts-ignore
    if (err.code && err.code === 4001) { //user rejected....
      return Promise.reject("Rejected the operation.");
    } else {
      return Promise.reject(err);
    }
  } finally {
    
  }
}
/**
 * XDefi Provider ** wrapp child components with xDefi wallet provider
 * @param param0 
 * @returns 
 */
const XChainProvider = ({ children }: { children: React.ReactNode }) => {
  //next router
  const router = useRouter();
  //atoms
  const [quoteSwap,] = useAtom(QuoteSwapResponseAtom);
  const [toToken,] = useAtom(toTokenAtom);
  const [fromToken,] = useAtom(fromTokenAtom);
  const [showTrxModal, setShowTrxModal] = useAtom(showTrxModalAtom);//show trx modal
  const [trxUrl, setTrxUrl] = useAtom(trxUrlAtom);
  const [xDefiAddresses, setXDefiAddresses] = useAtom(xDefiAddressesAtom);
  const [isWalletDetected, setIsWalletDetected] = useAtom(isWalletDetectedAtom);
  const [isConnecting, setIsConnecting] = useAtom(isConnectingAtom);
  const [xBalances, setXBalances] = useAtom(xBalancesAtom);
  const [chainList, setChainList] = useAtom(chainListAtom);
  //hooks
  const { showNotification } = useNotification();
  //chains that is selected at this moment
  const chains = chainList.filter((_chain: ChainType) => _chain.selected).map((_chain: ChainType) => _chain.label);
  //MsgDeposit
  const { MsgDeposit, MsgSend } = types;

  /**
   * get account using xfi wallet
   * @param chain "THOR" | "MAYA" | "BTC"
   * @returns address "xxxxxx..."
   */
  const _getAccount = (chain: string) => new Promise((resolve, reject) => {
    const methods: Record<string, string> = {
      "THOR": "thorchain",
      "MAYA": "mayachain",
      "BTC": "bitcoin"
    }

    try {
      //@ts-ignore
      if (window.xfi && window.xfi.bitcoin) {
        //@ts-ignore
        window.xfi[methods[chain]].request(
          { method: 'request_accounts', params: [] },
          //@ts-ignore
          (error, accounts) => {
            // console.log(accounts)
            if (error) {
              reject("");
            } else {
              resolve(accounts[0]);
            }
          }
        )
      }
    } catch (err) {
      reject("");
    }
  });
  /**
   * get kujira account
   * @returns address "xxxxxx..."
   */
  const _getKujiraAccount = async () => {
    //@ts-ignore
    if (!window.xfi?.keplr) {
      alert("Please install XDEFI extension");
    } else {
      const chainId = "kaiyo-1";
      //@ts-ignore
      const keplr = window.xfi.keplr;
      await keplr.enable(chainId);
      const offlineSigner = keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      return accounts[0].address;
    }
  }
  /**
   * get Ethereum account
   * @returns address "0xXXXXXX..."
   */
  const _getEVMAccount = async () => {
    //@ts-ignore
    const provider = window.xfi && window.xfi.ethereum && new ethers.providers.Web3Provider(window.xfi.ethereum);
    if (!provider) {
      return undefined;
    } else {
      //@ts-ignore
      const accounts = await provider.send("eth_requestAccounts", []);
      return ethers.utils.getAddress(accounts[0]);
    }
  }
  /**
   * get BTC balance
   * @param address btc address 
   * @param prices tokens prices 
   * @returns 
   */
  const getBTCbalance = async (address: string, prices: Record<string, number>) => {
    try {
      const { data } = await axios.get(`https://blockchain.info/q/addressbalance/${address}`);
      const wallet: any = {
        address,
        balance: [{
          address: "",
          asset: "BTC.BTC",
          value: prices["BTC.BTC"],
          amount: data / 10**8
        }],
        walletType: "XDEFI",
        chain: "BTC",
      }
      return wallet;
    } catch (err) {
      return {
        address,
        balance: [{
          address,
          //@ts-ignore
          symbol: "BTC", chain: "BTC", ticker: "BTC", value: prices["BTC.BTC"],
          amount: 0,
        }],
        walletType: "XDEFI",
        chain: "BTC",
      };
    }
  }
  /**
   * get MAYA balance (@cacao token)
   * @param address maya address 
   * @param prices tokens prices 
   * @returns 
   */
  const getMayaBalance = async (address: string, prices: Record<string, number>) => {
    const empty = {
      address,
      //@ts-ignore
      asset: "MAYA.CACAO", 
      value: prices["MAYA.CACAO"],
      amount: 0,
    }
    try {
      const { data } = await axios.get(`https://midgard.mayachain.info/v2/balance/${address}`);
      console.log(data)
      if (data.coins.length === 0) throw [];
      const wallet: any = {
        address,
        balance: data.coins.map((coin: any) => {
          const _asset = (coin.asset === "CACAO") ? "MAYA.CACAO" : coin.asset
          return {
            address,
            value: prices[_asset.replace("/", ".")], //synth -> original [ 'THOR/RUME' -> 'THOR.RUNE' ]
            amount: Number(coin.amount) / 10**TOKEN_DATA[_asset].decimals,
            asset: _asset
          }
        }),
        walletType: "XDEFI",
        chain: "MAYA",
      }
      return wallet;
    } catch (err) {
      return {
        address,
        balance: [empty],
        walletType: "XDEFI",
        chain: "MAYA",
      };
    }
  }
  /**
   * get KUJI balance
   * @param address kuji address 
   * @param prices tokens prices 
   * @returns 
   */
  const getKujiraBalance = async (address: string, prices: Record<string, number>) => {
    const empty = {
      address,
      //@ts-ignore
      asset: "KUJI.KUJI", 
      value: prices["KUJI"],
      amount: 0,
    }
    const TICKERS: Record<string, string> = { //this is for kuji asset
      "factory/kujira1qk00h5atutpsv900x202pxx42npjr9thg58dnqpa72f2p7m2luase444a7/uusk": "KUJI.USK",
      "ukuji": "KUJI.KUJI"
    }
    try {
      const { data } = await axios.get(`https://kujira-api.ibs.team/cosmos/bank/v1beta1/balances/${address}`);
      if (data.balances.length === 0) throw [];
      const wallet: any = {
        address,
        balance: data.balances.map((coin: any) => ({
          address,
          asset: TICKERS[coin.denom], 
          value: prices[TICKERS[coin.denom]],
          amount: Number(coin.amount) / 10 ** 6
        })),
        walletType: "XDEFI",
        chain: "KUJI",
      }
      return wallet;
    } catch (err) {
      return {
        address,
        balance: [empty],
        walletType: "XDEFI",
        chain: "KUJI",
      };
    }
  }
  /**
   * get THOR balance (@RUNE token)
   * @param address thor address 
   * @param prices tokens prices 
   * @returns 
   */
  const getThorBalance = async (address: string, prices: Record<string, number>) => {
    const empty = {
      address,
      //@ts-ignore
      asset: "THOR.RUNE", 
      value: prices["THOR.RUNE"],
      amount: 0,
    }
    try {
      const { data } = await axios.get(`https://midgard.ninerealms.com/v2/balance/${address}`);

      if (data.coins.length === 0) throw [];
      // const [chain, ticker] = data.coins[0].asset.split(".");
      const wallet: any = {
        address,
        balance: [{
          address,
          asset: data.coins[0].asset,
          value: prices["THOR.RUNE"],
          amount: Number(data.coins[0].amount) / 10 ** 8
        }],
        walletType: "XDEFI",
        chain: "THOR",
      }
      return wallet;
    } catch (err) {
      return {
        address,
        balance: [empty],
        walletType: "XDEFI",
        chain: "THOR",
      };
    }
  }
  /**
   * get ETH balance
   * @param account eth address "0xXXXX...."
   * @param prices token prices...
   * @returns 
   */
  const _getEthBalance = async (account: string, prices: Record<string, number>) => {

    console.log("@dew1204/fetching start eth balance in xDefi ----------------->");
    //@ts-ignore
    const provider = window.xfi && window.xfi.ethereum && new ethers.providers.Web3Provider(window.xfi.ethereum);
    //@ts-ignore
    const balances: IBalance[] = await Promise.all(Object.keys(ERC_20_ADDRESSES).map(async (asset: string) => {
      const _asset = "ETH." + asset;
      try {
        if (asset === "ETH") {
          const _eth = await provider.getBalance(account);
          console.log(ethers.utils.formatEther(_eth))
          return {
            address: account,
            asset: _asset, 
            value: prices[_asset],
            amount: String(ethers.utils.formatEther(_eth))
          }
        } else {
          const contract = new ethers.Contract(ERC_20_ADDRESSES[asset], ERC20_ABI, provider.getSigner());
          const balance = await contract.balanceOf(account)
          return {
            address: account,
            asset: _asset, 
            value: prices[_asset],
            amount: String(Number(balance)/10**TOKEN_DATA[_asset].decimals)
          }
        }
      } catch (err) {
        console.log(err)
        return {
          account,
          asset: _asset, 
          value: prices[_asset],
          amount: "0"
        }
      }
    }));
    const eth: IWallet = {
      address: account as string,
      balance: balances,
      walletType: "XDEFI",
      chain: "ETH",
    }
    console.log("@dew1204/xdefi eth balances -------------->", eth);
    return eth;
  }
  /**
   * connect wallet with xDefi ** use window.xfi ***
   */
  const connectToXDefi = async () => {
    setIsWalletDetected(false);
    try {
      const temp: Record<string, string> = {};
      for (let i = 0; i < chains.length; i++) {
        const chain = chains[i];
        switch (chain) {
          case "ETH":
            temp.ETH = await _getEVMAccount() as string;
            break;
          case "BTC":
            temp.BTC = await _getAccount("BTC") as string;
            break;
          case "KUJI":
            temp.KUJI = await _getKujiraAccount();
            break;
          case "THOR":
            temp.THOR = await _getAccount("THOR") as string;
            break;
          case "MAYA":
            temp.MAYA = await _getAccount("MAYA") as string;
            break;
        }
      }
      window.localStorage.setItem("lastWallet", "XDEFI");
      setXDefiAddresses(temp);
      setIsWalletDetected(true);
      getBalancesWithXDefi(temp);
    } catch (err) {
      console.log(err);
    }
  }
  /**
   * get wallet balance with xfi
   * @param addresses 
   */
  const getBalancesWithXDefi = async (addresses: Record<string, string> = xDefiAddresses) => {
    console.log("@dew1204/fetching start chain balances----------------->");

    setIsConnecting(true);
    setXBalances({});
    const prices = await _getPrices();
    const _xBalances: XBalances = {};

    await Promise.all(Object.keys(addresses).map(async (key: string) => {
      switch (key) {
        case "ETH":
          _xBalances.ETH = await _getEthBalance(addresses[key], prices);
          setXBalances({ ..._xBalances, "ETH": _xBalances.ETH });
          return;
        case "BTC":
          _xBalances.BTC = await getBTCbalance(addresses[key], prices);
          setXBalances({ ..._xBalances, "BTC": _xBalances.BTC });
          return;
        case "KUJI":
          _xBalances.KUJI = await getKujiraBalance(addresses[key], prices);
          setXBalances({ ..._xBalances, "KUJI": _xBalances.KUJI });
          return;
        case "THOR":
          _xBalances.THOR = await getThorBalance(addresses[key], prices);
          setXBalances({ ..._xBalances, "THOR": _xBalances.THOR });
          return;
        case "MAYA":
          _xBalances.MAYA = await getMayaBalance(addresses[key], prices);
          setXBalances({ ..._xBalances, "MAYA": _xBalances.MAYA });
          return;
      }
    }));
    console.log("@dew1204/xDefi balances -------------->", _xBalances);
    setIsConnecting(false);
  }
/**
 * send token in maya chain * CACAO, and synth tokens including sETH, sBTC, ... *
 * @param _amount number
 * @param _from string
 * @param _memo string
 * @param _asset string MAYA.CACAO, ETH/USDC ...
 * @returns tx hash
 */
  const _depositMaya = (_amount: number, _from: string, _memo: string, _asset: string) => new Promise(async (resolve, reject) => {
    const _tokenAsset = (_asset === "MAYA.CACAO") ? "CACAO" : _asset;
    const _decimals = (_tokenAsset === "CACAO") ? 10 : 8; // CACAO: 10, SYNTH: 8
    const { asset, from, amount, memo, gasLimit } = {
      asset: {
        chain: "MAYA",
        symbol: _tokenAsset,
        ticker: _tokenAsset,
      },
      from: _from,
      // recipient: _recipient,
      amount: {
        amount: Math.floor(_amount * 10**_decimals),
        decimals: _decimals
      },
      memo: _memo,
      gasLimit: '10000000', // optional
    };
    console.log("@Do cacao deposit -----------------------", { asset, from, decimals: _decimals, amount, memo, gasLimit });
    try {
      //@ts-ignore
      await window.xfi.mayachain.request(
        {
          method: 'deposit',
          params: [
            {
              asset,
              from,
              // recipient,
              amount,
              memo,
              gasLimit,
            },
          ],
        },
        //@ts-ignore
        (error, result) => {
          // console.debug(error, result);
          // this.lastResult = { error, result };
          if (error) {
            reject(error);
          } else {
            //40CDD29ADC180AB899774A72DC669636135A1C466047E967BDC26BF22929B0B9//@Thor transaction
            console.log("@xDefi maya transaction ----------------------------->", result);
            resolve(result);
          }
        }
      );
    } catch (err) {
      console.log(err)
      reject("");
    }
  });
  /**
   * send token in thor chain
   * @param _amount 
   * @param _from 
   * @param _recipient string
   * @param _memo string
   * @param _asset string THOR.RUNE ...
   * @returns tx hash
   */
  const _transferTHOR = (_amount: number, _from: string, _recipient: string, _memo: string, _asset: string) => new Promise(async (resolve, reject) => {
    const { asset, from, recipient, amount, memo, gasLimit } = {
      asset: {
        chain: "THOR",
        symbol: "RUNE",
        ticker: "RUNE",
      },
      from: _from,
      recipient: _recipient,
      amount: {
        amount: Math.floor(_amount * 10**8),
        decimals: 8
      },
      memo: _memo,
      gasLimit: '10000000', // optional
    };
    console.log("@Do cacao deposit -----------------------", { asset, from, recipient, decimals: 8, amount, memo, gasLimit });
    try {
      //@ts-ignore
      await window.xfi.thorchain.request(
        {
          method: 'transfer',
          params: [
            {
              asset,
              from,
              recipient,
              amount,
              memo,
              gasLimit,
            },
          ],
        },
        //@ts-ignore
        (error, result) => {
          // console.debug(error, result);
          // this.lastResult = { error, result };
          console.log(error)
          if (error) {
            reject(error);
          } else {
            //40CDD29ADC180AB899774A72DC669636135A1C466047E967BDC26BF22929B0B9//@Thor transaction
            console.log("@xDefi thor transaction ----------------------------->", result);
            resolve(result);
          }
        }
      );
    } catch (err) {
      console.log(err)
      reject("");
    }
  });
  /**
   * send token in thor chain
   * @param _amount 
   * @param _from 
   * @param _recipient string
   * @param _memo string
   * @param _asset string THOR.RUNE ...
   * @returns tx hash
   */
  const _transferBTC = (_amount: number, _from: string, _recipient: string, _memo: string, _asset: string) => new Promise(async (resolve, reject) => {

    const { from, recipient, amount, memo } = {
      from: _from,
      recipient: _recipient,
      amount: {
        amount: Math.floor(_amount*10**8),
        decimals: 8
      },
      memo: _memo,
    };
    console.log("@transfer BTC using xDefi -----------", { from, recipient, amount, memo });
    try {
      //@ts-ignore
      await window.xfi.bitcoin.request(
        {
          "method": "transfer",
          "params": [
            {
              feeRate: 70, //5 should be...
              from,
              recipient,
              amount,
              memo,
            },
          ],
        },
        //@ts-ignore
        (error, result) => {
          // console.debug(error, result);
          if (error) {
            reject(error);
          } else {
            //40CDD29ADC180AB899774A72DC669636135A1C466047E967BDC26BF22929B0B9//@Thor transaction
            console.log("@xDefi btc transaction ----------------------------->", result);
            resolve(result);
          }
        }
      );
    } catch (err) {
      console.log(err)
      reject("");
    }
  });
  /**
   * send token in thor chain
   * @param _amount 
   * @param _from 
   * @param _recipient string
   * @param _memo string
   * @param _asset string THOR.RUNE ...
   * @returns tx hash
   */
  const _transferKUJI = (_amount: number, _from: string, _recipient: string, _memo: string, _asset: string) => new Promise(async (resolve, reject) => {
    try {
      const DENOMS: Record<string, string> = { //this is for kuji asset
        "KUJI.USK": "factory/kujira1qk00h5atutpsv900x202pxx42npjr9thg58dnqpa72f2p7m2luase444a7/uusk",
        "KUJI.KUJI": "ukuji"
      }
      const { from, recipient, memo, denom } = {
        from: _from,
        recipient: _recipient,
        memo: _memo,
        denom: DENOMS[_asset]
      };
      console.log("@transfer KUJI|USK using xDefi -----------", { from, recipient, memo, denom });
      //@ts-ignore
      await keplr.enable("kaiyo-1");
      //@ts-ignore
      const offlineSigner = window.keplr.getOfflineSigner("kaiyo-1");
      //cosmos tx client          
      const txClient = await SigningStargateClient.connectWithSigner("https://kujira.rpc.kjnodes.com/", offlineSigner);

      const fee = {
        amount: [
          {
            denom: "ukuji", // Use the appropriate fee denom for your chain
            amount: "120000",
          },
        ],
        gas: "100000", // Set arbitrarily high gas limit; this is not actually deducted from user account.
      };
      const response = await txClient.sendTokens(
        from, 
        recipient, 
        [{
          denom,
          amount: String(Math.floor(_amount*10**6))
        }],
        fee,
        memo
      );
      //40CDD29ADC180AB899774A72DC669636135A1C466047E967BDC26BF22929B0B9//@Thor transaction
      console.log("@xDefi KUJI transaction ----------------------------->", response.transactionHash);
      resolve(response.transactionHash);
    } catch (err) {
      console.error(`Error sending transaction: ${err}`);
      reject (err)
    }
  })
  /**
   * transfer ERC20 token in ethereum mainnet
   * @param _amount amount to swap
   * @param _from my address
   * @param _memo memo for swap
   * @param _recipient inbound address
   * @returns 
   */
  const _transferEth = (_amount: number, _from: string,  _memo: string, _recipient: string) => new Promise(async (resolve, reject) => {
  // const _transferEth = (_amount: number, _from: string, _quoteSwap: IQuoteSwapResponse) => new Promise(async (resolve, reject) => {
    try {
      //@ts-ignore
      const provider = window.xfi && window.xfi.ethereum && new ethers.providers.Web3Provider(window.xfi.ethereum)
      if (!provider) throw "No ethers provider injected.";
      const signer = provider.getSigner();
      if (fromToken?.ticker === "ETH") {
        const data = await _sendEther (_amount, _from, _memo, _recipient, signer);
        resolve(data);
      } else if (fromToken?.ticker === "USDT" || fromToken?.ticker === "USDC" || fromToken?.ticker === "WSTETH") {
        const data = await _depositERC20Token (_amount, _from, _memo, _recipient, signer, fromToken?.ticker as string);
        resolve(data);
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
  /**
   * show transaction Modal
   * @param _url 
   */
  const _showTxModal = (_url: string) => {
    setTrxUrl(_url);
    setShowTrxModal(true);
  }
  /***
   * do xDefi swap 👁‍🗨
   */
  const doXDefiSwap = async (amount: number | string) => {
    try {
      const { data } = await axios.get(`https://mayanode.mayachain.info/mayachain/inbound_addresses`);
      if (fromToken?.chain !== "MAYA") {
        const _inbountAddress = data.find((item: any) => item.chain === fromToken?.chain);
        if (!_inbountAddress) throw "None inbound address";
        if (_inbountAddress.address !== quoteSwap?.inbound_address) throw "Invalid inbound address";
      }
      console.log("@deXdefiswap ---------------------", { amount, quoteSwap });
      if (!quoteSwap || !fromToken) { 
        throw "can't find quoteSwap!" 
      }
      let result: string = "";
      switch (fromToken?.chain) {
        case "MAYA": {
          result = await _depositMaya(amount as number, xBalances["MAYA"].address, quoteSwap.memo, fromToken.asset) as string;
          break;
        }
        case "BTC": {
          result = await _transferBTC(amount as number, xBalances["BTC"].address, quoteSwap.inbound_address, quoteSwap.memo, fromToken.asset) as string;
          break;
        }
        case "THOR": {
          result = await _transferTHOR(amount as number, xBalances["THOR"].address, quoteSwap.inbound_address, quoteSwap.memo, fromToken.asset) as string;
          break;
        }
        case "KUJI": {
          result = await await _transferKUJI(amount as number, xBalances["KUJI"].address, quoteSwap.inbound_address, quoteSwap.memo, fromToken.asset) as string;
          break;
        }
        case "ETH": {
          const data: any = await _transferEth(amount as number, xBalances["ETH"].address, quoteSwap.memo, quoteSwap.inbound_address);
          console.log("@xDefi transaction ----------------------------->", data);
          break;
        }
      }
      showNotification ("Transaction transfered successfully, It will take for a while", "info");
      return Promise.resolve(result);
    } catch (err) {
      console.log(err)
      showNotification(String(err), "warning");
      return Promise.reject("failed");
    }
  }
  /**
   * transfer token using xchainjs
   * @param asset "ETH.ETH"
   * @param decimals 18
   * @param amount 0.1
   * @param recipient 0x01012050123123....
   * @param address current asset's address
   * @param mayaAddress maya12351231
   * @param mode LIQUIDITY.SYM | LIQUIDITY.ASYM
   * @returns { hash, err }[] | undefined
   */
  const xDefiAddLPAsset = async({ asset, decimals, amount, recipient, mayaAddress, mode }: IParamsAddLPAsset) => {
    
    let _memo = mode === LIQUIDITY.SYM ? `+:${asset}:${mayaAddress}` : `+:${asset}::tt:75`;
    let _amount = amount;
    let _recipient = recipient;
    let _asset = asset;

    try {
      let hash: string = "";
      switch (TOKEN_DATA[asset].chain) {
        case "BTC":
          const result = await _transferBTC(_amount, xBalances["BTC"].address, _recipient, _memo, _asset);
          hash = result as string;
          break;
        case "THOR": {
          const result = await _transferTHOR(_amount, xBalances["THOR"].address, _recipient, _memo, _asset);
          hash = result as string;
          break;
        }
        case "KUJI": {
          const result = await await _transferKUJI(_amount, xBalances["KUJI"].address, _recipient, _memo, _asset);
          hash = result as string;
          break;
        }
        case "ETH": {
          const result: any = await _transferEth(_amount, xBalances["ETH"].address, _recipient, _memo);
          console.log("@xDefi transaction ----------------------------->", result);
          hash = result.hash as string;
          break;
        }
      }
      showNotification(`${asset} sent successfully.`, "success"); //show first message
      return Promise.resolve(hash);
    } catch (err) {
      console.log("@while adding cacao liquidity ---------------", err);
      return Promise.reject(String(err));
    }
  };
  /**
   * transfer assset for add liquidity using xchainjs
   * @param amount 0.1
   * @param address current asset's address
   * @mayaAddress current maya address
   * @returns hash 
   */
  const xDefiAddLPCACAO = async({ asset, amount, address, mayaAddress }: IParamsAddLPCACAO) => {

    const { data }: { data: IPool } = await axios.get(`https://midgard.mayachain.info/v2/pool/${asset}`);
    const _asset = "MAYA.CACAO";
    const _amount = Number(data.assetPrice)*Number(amount);
    const _memo = `+:${asset}:${address}::tt:75`;
    const _address = mayaAddress;
    
    try {
      const hash = await _depositMaya(_amount, _address, _memo, _asset) as string;
      showNotification(`${_asset} sent successfully.`, "success"); //show second message
      return Promise.resolve(hash);
    } catch (err) {
      console.log("@while add cacao liquidity--------------", err);
      showNotification("Cacao deposit failed, Please try again.", "error");
      return Promise.reject(String(err));
    }
  };
  /**
   * transfer token using xchainjs
   * @param asset "ETH.ETH"
   * @param decimals 18
   * @param amount 0.1
   * @param recipient 0x01012050123123....
   * @param address current asset's address
   * @param mayaAddress maya12351231
   * @param mode LIQUIDITY.SYM | LIQUIDITY.ASYM
   * @returns { hash, url }[] | undefined
   */
  const xDefiWithdrawLiquidity = async({ asset, decimals, bps, recipient, address, mayaAddress, mode }: IParamsWithdrawLiquidity) => {

    const _memo = mode === LIQUIDITY.SYM ? `-:${asset}:${bps}` : `-:${asset}:${bps}:${asset}`;
    // if (mode === LIQUIDITY.SYM) {
    let _amount = MINIMUM_AMOUNT['MAYA'];
    let _recipient = recipient;
    let _asset = "MAYA.CACAO";
      
    console.log("@asym Withdraw LP -------------", {
      asset: _asset,
      amount: _amount,
      memo: _memo,
      walletIndex: 0
    });
    // return Promise.resolve("699F52641E113B8204B1F55C18625854E3ECB48EF7B8B90D9E206DD11695A5DD");
    if (mode === LIQUIDITY.SYM) {
      try {
        const hash = await _depositMaya(_amount, mayaAddress, _memo, _asset) as string;
        showNotification(`${asset} sent successfully.`, "success"); //show second message
        return Promise.resolve(hash);
      } catch (err) {
        console.log("@while cacao deposit ---------------", err);
        return Promise.reject(String(err));
      }
    } else if (mode === LIQUIDITY.ASYM) {
      try {
        let hash: string = "";
        const _chain = TOKEN_DATA[asset].chain;
        _amount = MINIMUM_AMOUNT[_chain];
        switch (_chain) {
          case "BTC":
            const result = await _transferBTC(_amount, address, _recipient, _memo, asset);
            hash = result as string;
            break;
          case "THOR": {
            // throw "Too small trasaction will be failed."
            const result = await _transferTHOR(_amount, address, _recipient, _memo, asset);
            hash = result as string;
            break;
          }
          case "KUJI": {
            const result = await await _transferKUJI(_amount, address, _recipient, _memo, asset);
            hash = result as string;
            break;
          }
          case "ETH": {
            const result: any = await _transferEth(_amount, address, _recipient, _memo);
            console.log("@xDefi transaction ----------------------------->", result);
            hash = result.hash as string;
            break;
          }
        }
        showNotification(`${asset} sent successfully.`, "success"); //show second message
        return Promise.resolve(hash);
      } catch (err) {
        console.log("@while token withdraw ---------------", err);
        return Promise.reject(String(err));
      }
    }
  }

  return (
    <XDefiContext.Provider value={{ connectToXDefi, getBalancesWithXDefi, doXDefiSwap, xDefiWithdrawLiquidity, xDefiAddLPAsset, xDefiAddLPCACAO}}>
      {children}
    </XDefiContext.Provider>
  )
}

export default XChainProvider;


