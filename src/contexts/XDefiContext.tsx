"use client"

import React from "react";
import { useAtom } from "jotai";
import { ethers } from 'ethers';
import axios from 'axios';
import { ETHERSCAN_API_KEY } from "@/config"; 
import { useRouter } from "next/navigation";


import {
  isConnectingAtom,
  chainListAtom,
  xBalancesAtom,
  xDefiAddressesAtom,
  isWalletDetectedAtom
} from "@/store";
//types
import { ChainType, XClients, XBalances, IBalance, IWallet } from "@/types/minis";
//data
import { NATIVE_TOKENS, USDT_ADDRESS, USDC_ADDRESS, WSTETH_ADDRESS } from "@/utils/data";
//context type
interface IXDefiContext {
  connectToXDefi: () => Promise<void>,
  getBalancesWithXDefi: () => Promise<void>
}
//abis
import { ERC20 } from "@/utils/ABIs/standards";
//prices methods
import { _getPrices } from "./XChainContext";
/**
 * XDefiContext
*/
export const XDefiContext = React.createContext<IXDefiContext | undefined>(undefined);

const XChainProvider = ({ children }: { children: React.ReactNode }) => {

  const router = useRouter ();
  const [xBalances, setXBalances] = useAtom(xBalancesAtom);
  const [chainList, setChainList] = useAtom(chainListAtom);
  const [isConnecting, setIsConnecting] = useAtom(isConnectingAtom);
  const [xDefiAddresses, setXDefiAddresses] = useAtom(xDefiAddressesAtom);
  const [isWalletDetected, setIsWalletDetected] = useAtom(isWalletDetectedAtom);
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
          {method: 'request_accounts', params: []},
           //@ts-ignore
          (error, accounts) => {
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
    if(!provider) {
      return undefined;
    } else {
      //@ts-ignore
      const accounts = await provider.send("eth_requestAccounts", []);
      return accounts[0];
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
  const getMayaBalance = async (address:string, prices: Record<string, number>) => {
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
          amount: Number(coin.amount) / 10**10
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
  const getKujiraBalance = async (address:string, prices: Record<string, number>) => {
    const empty = {
      address,
      //@ts-ignore
      symbol: "KUJI", chain: "KUJI", ticker: "KUJI", value: prices["KUJI"],
      amount: 0,
    }
    try {
      const { data } = await axios.get(`https://lcd-kujira.whispernode.com/cosmos/bank/v1beta1/balances/${address}`);
      if (data.coins.length === 0) throw [];
      const wallet: any = {
        address,
        balance: data.balances.map((coin: any) => ({
          address,
          symbol: coin.asset, chain: "KUJI", ticker: "KUJI", value: prices["KUJI"],
          amount: coin.amount
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
  const getThorBalance = async (address:string, prices: Record<string, number>) => {
    const empty = {
      address,
      //@ts-ignore
      symbol: "RUNE", chain: "THOR", ticker: "RUNE", value: prices["RUNE"],
      amount: 0,
    }
    try {
      const { data } = await axios.get(`https://midgard.ninerealms.com/v2/balance/${address}`);
      if (data.coins.length === 0) throw [];
      const wallet: any = {
        address,
        balance: data.coins.map((coin: any) => ({
          address,
          symbol: coin.asset, chain: "THOR", ticker: coin.asset, value: prices[coin.asset],
          amount: coin.amount
        })),
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
  const _getEthBalance = async (account:string, prices: Record<string, number>) => {

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
    const balances: IBalance[] = await Promise.all(tokens.map(async({address, asset}: Token) => {
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
      walletType: "METAMASK",
      chain: "ETH",
    }

    console.log("@dew1204/xdefi eth balances -------------->", eth);
    return eth;
  }
  /**
   * connect wallet with xDefi
   */
  const connectToXDefi = async () => {
    setIsWalletDetected (false);
    try {
      const temp: Record<string, string> = {};
      for (let i = 0; i < chains.length; i++) {
        const chain = chains[i];
        switch (chain) {
          case "ETH": 
            temp.ETH =  await _getEVMAccount () as string;
            break;
          case "BTC":
            temp.BTC = await _getAccount ("BTC") as string;
            break;
          case "KUJI":
            temp.KUJI = await _getKujiraAccount();
            break;
          case "THOR":
            temp.THOR = await _getAccount ("THOR") as string;
            break;
          case "MAYA":
            temp.MAYA = await _getAccount ("MAYA") as string;
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
  const getBalancesWithXDefi = async (addresses : Record<string, string> = xDefiAddresses) => {
    console.log("@dew1204/fetching start chain balances----------------->");

    setIsConnecting (true);
    setXBalances ({});
    const prices = await _getPrices();
    const _xBalances: XBalances = {};

    await Promise.all(Object.keys(addresses).map(async(key: string) => {
      switch (key) {
        case "ETH": 
          _xBalances.ETH =  await _getEthBalance(addresses[key], prices);
          setXBalances({..._xBalances, "ETH": _xBalances.ETH});
          return;
        case "BTC":
          _xBalances.BTC = await getBTCbalance(addresses[key], prices);
          setXBalances({..._xBalances, "BTC": _xBalances.BTC});
          return;
        case "KUJI":
          _xBalances.KUJI = await getKujiraBalance(addresses[key], prices);
          setXBalances({..._xBalances, "KUJI": _xBalances.KUJI});
          return;
        case "THOR":
          _xBalances.THOR = await getThorBalance(addresses[key], prices);
          setXBalances({..._xBalances, "THOR": _xBalances.THOR});
          return;
        case "MAYA":
          _xBalances.MAYA = await getMayaBalance (addresses[key], prices);
          setXBalances({..._xBalances, "MAYA": _xBalances.MAYA});
          return;
      }
    }));
    console.log("@dew1204/xDefi balances -------------->", _xBalances);
    setIsConnecting(false);
  }
  
  return (
    <XDefiContext.Provider value={{ connectToXDefi, getBalancesWithXDefi }}>
      {children}
    </XDefiContext.Provider>
  )
}

export default XChainProvider;

function _getEVMAccount(): any {
  throw new Error("Function not implemented.");
}
