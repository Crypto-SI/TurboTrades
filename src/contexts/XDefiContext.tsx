"use client"

import React from "react";
import { useAtom } from "jotai";
import { ethers } from 'ethers';
import axios from 'axios';
import { ETHERSCAN_API_KEY } from "@/config";
import { SigningCosmosClient } from "@cosmjs/launchpad";
import { useRouter } from "next/navigation";
import useNotification from "@/hooks/useNotification";
import { SigningArchwayClient } from '@archwayhq/arch3.js';
import BigNumber from 'bignumber.js';

import {
  isConnectingAtom,
  chainListAtom,
  xBalancesAtom,
  xDefiAddressesAtom,
  isWalletDetectedAtom,
  QuoteSwapResponseAtom,
  fromTokenAtom,
  toTokenAtom,
} from "@/store";
//types
import { ChainType, XClients, XBalances, IBalance, IWallet } from "@/types/minis";
//data
import { NATIVE_TOKENS, USDT_ADDRESS, USDC_ADDRESS, WSTETH_ADDRESS, ERC_20_ADDRESSES } from "@/utils/data";
//context type
interface IXDefiContext {
  connectToXDefi: () => Promise<void>,
  getBalancesWithXDefi: () => Promise<void>,
  doXDefiSwap: (amount: number | string) => Promise<void>
}
//abis
import { ERC20 } from "@/utils/ABIs/standards";
//prices methods
import { _getPrices } from "./XChainContext";
import { QuoteSwapParams } from "@xchainjs/xchain-mayachain-query";
import { IQuoteSwapResponse } from "@/types/maya";
/**
 * XDefiContext
*/
export const XDefiContext = React.createContext<IXDefiContext | undefined>(undefined);

//send ETH
export const _sendEther = async (_amount: number, _from: string, _quoteSwap: IQuoteSwapResponse, signer: any) => {
  try {
    console.log({ memo: _quoteSwap.memo, _amount, recipient: _quoteSwap.inbound_address })
    const memo = ethers.utils.toUtf8Bytes(_quoteSwap.memo);
    const recipient = _quoteSwap.inbound_address;
    // const data = ethers.utils.formatBytes32String(memo);
    const transaction = {
      to: recipient,
      data: memo,
      value: ethers.utils.parseEther(String(_amount)),
    }
    const tx = await signer.sendTransaction(transaction);
    console.log(tx)
    return Promise.resolve(tx);
  } catch (err) {
    return Promise.reject(err);
  }
}
/**
 * transfer ERC20 token to another address with memo
 * @param _amount token amount to transfer
 * @param _from from address
 * @param _quoteSwap Swap params
 * @param signer Web3 signer
 * @param symbol token symbol "USDT", "USDC", "WSTETH"
 * @returns Promise<>
 */
export const _sendERC20Token = async (_amount: number, _from: string, _quoteSwap: IQuoteSwapResponse, signer: any, symbol: string) => {
  try {
    const contract = new ethers.Contract(ERC_20_ADDRESSES[symbol], ERC20, signer);
    // const memo = ethers.utils.toUtf8Bytes(_quoteSwap.memo);
    const memo = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(_quoteSwap.memo));
    const recipient = _quoteSwap.inbound_address;
    const data = contract.interface.encodeFunctionData('transfer', [recipient, ethers.utils.parseEther(String(_amount))]);

    const transaction = {
      to: recipient,
      // we need to slice the memo to remove 0x before appending
      data: data + memo.slice(2),
    };
    const tx = await signer.sendTransaction(transaction);
    console.log("@dew1204--------------------------->", tx);
    const hexMemo = tx.data.substring(138, tx.data.length);

    const memoString = ethers.utils.toUtf8String("0x" + hexMemo);

    console.log("memoString: " + memoString) ;
    return Promise.resolve("");
  } catch (err) {
    console.log(err)
    return Promise.reject(err);
  }
}


const XChainProvider = ({ children }: { children: React.ReactNode }) => {

  const router = useRouter();
  const [xBalances, setXBalances] = useAtom(xBalancesAtom);
  const [chainList, setChainList] = useAtom(chainListAtom);
  const [isConnecting, setIsConnecting] = useAtom(isConnectingAtom);
  const [xDefiAddresses, setXDefiAddresses] = useAtom(xDefiAddressesAtom);
  const [isWalletDetected, setIsWalletDetected] = useAtom(isWalletDetectedAtom);
  const [quoteSwap, setQuoteSwap] = useAtom(QuoteSwapResponseAtom);
  const [toToken,] = useAtom(toTokenAtom);
  const [fromToken,] = useAtom(fromTokenAtom);
  const { showNotification } = useNotification();
  //chains that is selected at this moment
  const chains = chainList.filter((_chain: ChainType) => _chain.selected).map((_chain: ChainType) => _chain.label);
  //get accont
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
            console.log(accounts)
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
  //get kujira account
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
  //get ethereum account
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
  //get btc balance
  const getBTCbalance = async (address: string, prices: Record<string, number>) => {
    try {
      const { data } = await axios.get(`https://blockchain.info/q/addressbalance/${address}`);
      const wallet: any = {
        address,
        balance: [{
          address: "",
          symbol: "BTC", chain: "BTC", ticker: "BTC", value: prices["BTC"],
          amount: data
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
          symbol: "BTC", chain: "BTC", ticker: "BTC", value: prices["BTC"],
          amount: 0,
        }],
        walletType: "XDEFI",
        chain: "BTC",
      };
    }
  }
  //get MAYA balance ($CACAO token)
  const getMayaBalance = async (address: string, prices: Record<string, number>) => {
    const empty = {
      address,
      //@ts-ignore
      symbol: "CACAO", chain: "MAYA", ticker: "CACAO", value: prices["CACAO"],
      amount: 0,
    }
    try {
      const { data } = await axios.get(`https://midgard.mayachain.info/v2/balance/${address}`);
      if (data.coins.length === 0) throw [];
      const wallet: any = {
        address,
        balance: data.coins.map((coin: any) => ({
          address,
          symbol: coin.asset, chain: "MAYA", ticker: coin.asset, value: prices[coin.asset],
          amount: Number(coin.amount) / 10 ** 10
        })),
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
  //get Kuji balance 
  const getKujiraBalance = async (address: string, prices: Record<string, number>) => {
    const empty = {
      address,
      //@ts-ignore
      symbol: "KUJI", chain: "KUJI", ticker: "KUJI", value: prices["KUJI"],
      amount: 0,
    }

    const TICKERS: Record<string, string> = { //this is for kuji asset
      "factory/kujira1qk00h5atutpsv900x202pxx42npjr9thg58dnqpa72f2p7m2luase444a7/uusk": "USK",
      "ukuji": "KUJI"
    }

    try {
      const { data } = await axios.get(`https://kujira-api.ibs.team/cosmos/bank/v1beta1/balances/${address}`);
      console.log(data)
      if (data.balances.length === 0) throw [];
      const wallet: any = {
        address,
        balance: data.balances.map((coin: any) => ({
          address,
          symbol: coin.asset, chain: "KUJI", ticker: TICKERS[coin.denom], value: prices[TICKERS[coin.denom]],
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
  //get thor balance
  const getThorBalance = async (address: string, prices: Record<string, number>) => {
    const empty = {
      address,
      //@ts-ignore
      symbol: "RUNE", chain: "THOR", ticker: "RUNE", value: prices["RUNE"],
      amount: 0,
    }
    try {
      const { data } = await axios.get(`https://midgard.ninerealms.com/v2/balance/${address}`);

      if (data.coins.length === 0) throw [];
      const [chain, ticker] = data.coins[0].asset.split(".");
      const wallet: any = {
        address,
        balance: [{
          address,
          symbol: ticker, chain: chain, ticker: ticker, value: prices[ticker],
          amount: Number(data.coins[0].amount) / 10 ** 8
        }],
        // balance: data.coins.map((coin: any) => {
        //   const [chain, ticker] = coin.asset.split(".");
        //   return {
        //     address,
        //     symbol: ticker, chain: chain, ticker: ticker, value: prices[ticker],
        //     amount: Number(coin.amount) / 10**8
        //   }
        // }),
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
  //get ETH balance
  const _getEthBalance = async (account: string, prices: Record<string, number>) => {

    type Token = {
      address: string,
      asset: string
    }

    const tokens: Token[] = [
      { address: "", asset: "ETH" },
      { address: USDC_ADDRESS, asset: "USDC" },
      { address: USDT_ADDRESS, asset: "USDT" },
      { address: WSTETH_ADDRESS, asset: "WSTETH" },
    ]

    console.log("@dew1204/fetching start eth balance in xDefi ----------------->");
    //@ts-ignore
    const provider = window.xfi && window.xfi.ethereum && new ethers.providers.Web3Provider(window.xfi.ethereum);
    //@ts-ignore
    const balances: IBalance[] = await Promise.all(tokens.map(async ({ address, asset }: Token) => {
      try {
        if (asset === "ETH") {
          const _eth = await provider.getBalance(account);
          console.log(ethers.utils.formatEther(_eth))
          return {
            address: account,
            symbol: asset, chain: "ETH", asset, value: prices[asset], ticker: asset,
            amount: String(ethers.utils.formatEther(_eth))
          }
        } else {
          const contract = new ethers.Contract(address, ERC20, provider.getSigner());
          const balance = await contract.balanceOf(account)
          return {
            address: account,
            symbol: asset, chain: "ETH", asset, value: prices[asset], ticker: asset,
            amount: String(ethers.utils.formatEther(balance))
          }
        }
      } catch (err) {
        console.log(err)
        return {
          account,
          symbol: asset, chain: "ETH", asset, value: prices[asset], ticker: asset,
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
   * connect wallet with xDefi
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
  //get wallet balances with xDefi
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

  //send Maya
  const _transferMaya = (_amount: number, _from: string, _quoteSwap: IQuoteSwapResponse) => new Promise(async (resolve, reject) => {

    console.log("---------------- Do cacao transfer -----------------------");

    const { asset, from, recipient, amount, memo, gasLimit } = {
      asset: {
        chain: "MAYA",
        symbol: "CACAO",
        ticker: "CACAO",
      },
      from: _from,
      recipient: _quoteSwap.inbound_address,
      amount: {
        amount: _amount,
        decimals: 8
      },
      memo: _quoteSwap.memo,
      gasLimit: '10000000', // optional
    };
    try {
      //@ts-ignore
      const data = await window.xfi.mayachain.request(
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
          if (error) {
            reject(error);
          } else {
            console.log(result);
            resolve(result);
          }
        }
      );
    } catch (err) {
      console.log(err)
      reject("");
    }
  });
  //send Maya
  const _transferTHOR = (_amount: number, _from: string, _quoteSwap: IQuoteSwapResponse) => new Promise(async (resolve, reject) => {

    console.log("---------------- Do Thor transfer -----------------------");

    const { asset, from, recipient, amount, memo, gasLimit } = {
      asset: {
        chain: "THOR",
        symbol: "RUNE",
        ticker: "RUNE",
      },
      from: _from,
      recipient: _quoteSwap.inbound_address,
      amount: {
        amount: _amount,
        decimals: 8
      },
      memo: _quoteSwap.memo,
      gasLimit: '10000000', // optional
    };
    try {
      console.log(from, recipient)
      //@ts-ignore
      const data = await window.xfi.thorchain.request(
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
          if (error) {
            reject(error);
          } else {
            console.log(result);
            resolve(result);
          }
        }
      );
    } catch (err) {
      console.log(err)
      reject("");
    }
  });
  //send in BTC
  const _transferBTC = (_amount: number, _from: string, _quoteSwap: IQuoteSwapResponse) => new Promise(async (resolve, reject) => {

    console.log("---------------- Do btc transfer -----------------------");

    console.log(_from)
    const { from, recipient, amount, memo, gasLimit } = {
      from: _from,
      recipient: _quoteSwap.inbound_address,
      amount: {
        amount: _amount,
        decimals: 8
      },
      memo: _quoteSwap.memo,
      gasLimit: '10000000', // optional
    };
    try {
      //@ts-ignore
      window.xfi.bitcoin.request(
        {
          method: "transfer",
          params: [
            {
              feeRate: 70,
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
          // this.lastResult = { error, result };
          if (error) {
            reject(error);
          } else {
            console.log(result);
            resolve(result);
          }
        }
      );
    } catch (err) {
      console.log(err)
      reject("");
    }
  });
  //send KUJI
  const _transferKUJI = (_amount: number, _from: string, _quoteSwap: IQuoteSwapResponse) => new Promise(async (resolve, reject) => {
    try {
      //@ts-ignore
      if (!window.xfi?.keplr) throw "Can't find keplr wallet provider";
      const chainId = "kaiyo-1";
      //@ts-ignore
      const keplr = window.xfi.keplr;
      await keplr.enable(chainId);
      const offlineSigner = keplr.getOfflineSigner(chainId);
      const accounts = await offlineSigner.getAccounts();
      const account = accounts[0].address;
      const recepient = _quoteSwap.inbound_address;
      const cosmJS = new SigningCosmosClient(
        "https://lcd-cosmoshub.keplr.app/rest",
        accounts[0].address,
        offlineSigner
      );

      // console.log("----------------- kuji swap --------------");
      const amount = [{ denom: "ukuji", amount: String(_amount * 10 ** 6) }];
      const memo = _quoteSwap.memo;

      // const result = await cosmJS.sendTokens(_quoteSwap.inbound_address, amount, memo);
      // console.log("Transaction result:", result);
      // resolve(result)

      const sendResult = await cosmJS.sendTokens(
        recepient,
        amount,
        memo
      )

      console.log("Transaction result:", sendResult);
    } catch (err) {
      console.log(err);
      reject();
    }

  })
  //transfer Eth
  const _transferEth = (_amount: number, _from: string, _quoteSwap: IQuoteSwapResponse) => new Promise(async (resolve, reject) => {
    try {
      //@ts-ignore
      const provider = window.xfi && window.xfi.ethereum && new ethers.providers.Web3Provider(window.xfi.ethereum)
      if (!provider) throw "No ethers provider injected.";
      const signer = provider.getSigner();
      if (fromToken?.ticker === "ETH") {
        const data = await _sendEther (_amount, _from, _quoteSwap, signer);
        resolve(data);
      } else if (fromToken?.ticker === "USDT") {
        // const data = await _sendEther (_amount, _from, _quoteSwap, signer);
        // resolve(data);
      } else if (fromToken?.ticker === "USDC") {
        const data = await _sendERC20Token (_amount, _from, _quoteSwap, signer, "USDC");
        resolve(data);
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });

  const doXDefiSwap = async (amount: number | string) => {
    try {
      const { data } = await axios.get(`https://mayanode.mayachain.info/mayachain/inbound_addresses`);
      if (fromToken?.chain !== "MAYA") {
        const _inbountAddress = data.find((item: any) => item.chain === fromToken?.chain);
        if (!_inbountAddress) throw "None inbound address";
        if (_inbountAddress.address !== quoteSwap?.inbound_address) throw "Invalid inbound address";
      }
      console.log(amount, quoteSwap);
      switch (fromToken?.chain) {
        case "MAYA":
          await _transferMaya(amount as number, xBalances["MAYA"].address, quoteSwap as IQuoteSwapResponse);
          break;
        case "BTC":
          await _transferBTC(amount as number, xBalances["BTC"].address, quoteSwap as IQuoteSwapResponse);
          break;
        case "THOR":
          await _transferTHOR(amount as number, xBalances["THOR"].address, quoteSwap as IQuoteSwapResponse);
          break;
        case "KUJI":
          await _transferKUJI(amount as number, xBalances["KUJI"].address, quoteSwap as IQuoteSwapResponse);
          break;
        case "ETH":
          const data = await _transferEth(amount as number, xBalances["ETH"].address, quoteSwap as IQuoteSwapResponse);
          console.log(data);
          break;
      }
      showNotification ("Transaction transfered successfully, It will take for a while", "info");
    } catch (err) {
      console.log(err)
      showNotification(String(err), "warning");
    }

  }

  return (
    <XDefiContext.Provider value={{ connectToXDefi, getBalancesWithXDefi, doXDefiSwap }}>
      {children}
    </XDefiContext.Provider>
  )
}

export default XChainProvider;

function _getEVMAccount(): any {
  throw new Error("Function not implemented.");
}
