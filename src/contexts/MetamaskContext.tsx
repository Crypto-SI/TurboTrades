"use client"

import React from "react";
import { useAtom } from "jotai";
import { ethers } from 'ethers';
import axios from 'axios';
import { ETHERSCAN_API_KEY } from "@/config";
import { injected } from "@/utils/connectors";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from 'next/navigation';
import useNotification from "@/hooks/useNotification";
//atoms
import {
  isConnectingAtom,
  chainListAtom,
  xBalancesAtom,
  xDefiAddressesAtom,
  isWalletDetectedAtom,
  fromTokenAtom,
  toTokenAtom,
  QuoteSwapResponseAtom
} from "@/store";
//types
import { ChainType, IBalance, IWallet } from "@/types/minis";
import { IQuoteSwapResponse } from "@/types/maya";
//data
import { NATIVE_TOKENS } from "@/utils/data";
//context type
interface IMetamaskContext {
  connectToMetamask: () => Promise<any>,
  getBalanceWithMetamask: () => Promise<void>
  doMetamaskSwap: (amount: string | number) => Promise<void>
}
//data
import { USDT_ADDRESS, USDC_ADDRESS, WSTETH_ADDRESS } from "@/utils/data";
//abis
import { ERC20 } from "@/utils/ABIs/standards";
//third parties
import { _getPrices } from "./XChainContext";

import { _sendEther, _sendERC20Token } from "./XDefiContext"; //send ERC20 tokens
/**
 * MetamaskContext
*/
export const MetamaskContext = React.createContext<IMetamaskContext | undefined>(undefined);

const XChainProvider = ({ children }: { children: React.ReactNode }) => {
  //hooks
  const router = useRouter ();
  const { showNotification } = useNotification ();
  const { account, library, chainId, activate, deactivate } = useWeb3React();
  //atoms
  const [xBalances, setXBalances] = useAtom(xBalancesAtom);
  const [chainList, setChainList] = useAtom(chainListAtom);
  const [isConnecting, setIsConnecting] = useAtom(isConnectingAtom);
  const [xDefiAddresses, setXDefiAddresses] = useAtom(xDefiAddressesAtom);
  const [isWalletDetected, setIsWalletDetected] = useAtom(isWalletDetectedAtom);
  const [quoteSwap,] = useAtom(QuoteSwapResponseAtom);
  const [toToken,] = useAtom(toTokenAtom);
  const [fromToken,] = useAtom(fromTokenAtom);
  //chains that is selected at this moment
  const chains = chainList.filter((_chain: ChainType) => _chain.selected).map((_chain: ChainType) => _chain.label);
  //get accont
  const _getAccount = (chain: string) => new Promise((resolve, reject) => { });
  //get balance
  const getBalance = async (address: string, token: string) => {
    const contract = new ethers.Contract(address, ERC20, library.getSigner());
    const balance = (await contract.balanceOf(account)).toString();
    return balance;
  }

  const getBalanceWithMetamask = async () => {
    if (!account) {
      return;
    } 
    try {
      setIsConnecting (true);
      setXBalances ({});
      if (chainId !== 1) {
        await _changeNetwork ();
      }
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
      const prices = await _getPrices();
      console.log("@dew1204/fetching start chain balances----------------->");
      //@ts-ignore
      const balances: IBalance[] = await Promise.all(tokens.map(async({address, asset}: Token) => {
        try {
          if (asset === "ETH") {
            const _eth = await library.getSigner().provider.getBalance(account);
            console.log(ethers.utils.formatEther(_eth))
            return {
              address: account,
              symbol: asset, chain: "ETH", asset, value: prices[asset], ticker: asset,
              amount: String(ethers.utils.formatEther(_eth))
            }
          } else {
            const contract = new ethers.Contract(address, ERC20, library.getSigner());
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
      setXBalances({"ETH": eth});
      console.log("@dew1204/metamask balances -------------->", eth);
    } catch (err) {
      console.log(err)
    } finally {
      setIsConnecting(false);
    }
  }

  React.useEffect(() => {
    if (account) {
      getBalanceWithMetamask ();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const _changeNetwork = () => new Promise(async(resolve, reject) => {
    //@ts-ignore
    if (window.ethereum) {
      try {
        //@ts-ignore
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        })
        resolve("");
      } catch (error) {
        console.error(error);
        reject("");
      }
    }
  });

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
      } else {
        const data = await _sendERC20Token (_amount, _from, _quoteSwap, signer, String(fromToken?.ticker));
        resolve(data);
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
  //do swap using metamask
  const doMetamaskSwap = async (amount: number | string) => {
    console.log(amount)
    try {
      const { data } = await axios.get(`https://mayanode.mayachain.info/mayachain/inbound_addresses`);
      const _inbountAddress = data.find((item: any) => item.chain === "ETH");
      if (!_inbountAddress) throw "None inbound address";
      if (_inbountAddress.address !== quoteSwap?.inbound_address) throw "Invalid inbound address";

      if (fromToken?.ticker === "ETH") {
        const data = await _transferEth(amount as number, xBalances["ETH"].address, quoteSwap as IQuoteSwapResponse);
      } else {
        // const data = await 
      }
  
    } catch (err) {
      console.log(err)
      showNotification(String(err), "warning");
    }
  }
  const connectToMetamask = () => new Promise(async(resolve, reject) => {
    try {
      setIsWalletDetected (false);
      await activate(injected, async (error) => {
        console.log(error.message);
        reject ("Cancel the operation...");
      });
      window.localStorage.setItem("lastWallet", "Metamask");
      setIsWalletDetected (true);
      resolve("");
    } catch (e) {
      return reject();
    }
  });

  return (
    <MetamaskContext.Provider value={{ connectToMetamask, getBalanceWithMetamask, doMetamaskSwap }}>
      {children}
    </MetamaskContext.Provider>
  )
}

export default XChainProvider;

