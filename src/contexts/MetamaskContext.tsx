"use client"

import React from "react";
import { useAtom } from "jotai";
import { ethers } from 'ethers';
import axios from 'axios';
import { ETHERSCAN_API_KEY } from "@/config";
import { injected } from "@/utils/connectors";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from 'next/navigation';

import {
  isConnectingAtom,
  chainListAtom,
  xBalancesAtom,
  xDefiAddressesAtom,
  isWalletDetectedAtom
} from "@/store";
//types
import { ChainType, IBalance, IWallet } from "@/types/minis";
//data
import { NATIVE_TOKENS } from "@/utils/data";
//context type
interface IMetamaskContext {
  connectToMetamask: () => Promise<any>,
  getBalanceWithMetamask: () => Promise<void>
}
//data
import { USDT_ADDRESS, USDC_ADDRESS, WSTETH_ADDRESS } from "@/utils/data";
//abis
import { ERC20 } from "@/utils/ABIs/standards";
//third parties
import { _getPrices } from "./XChainContext";
/**
 * MetamaskContext
*/
export const MetamaskContext = React.createContext<IMetamaskContext | undefined>(undefined);

const XChainProvider = ({ children }: { children: React.ReactNode }) => {

  const router = useRouter ();
  const { account, library, chainId, activate, deactivate } = useWeb3React();

  const [xBalances, setXBalances] = useAtom(xBalancesAtom);
  const [chainList, setChainList] = useAtom(chainListAtom);
  const [isConnecting, setIsConnecting] = useAtom(isConnectingAtom);
  const [xDefiAddresses, setXDefiAddresses] = useAtom(xDefiAddressesAtom);
  const [isWalletDetected, setIsWalletDetected] = useAtom(isWalletDetectedAtom);
  //chains that is selected at this moment
  const chains = chainList.filter((_chain: ChainType) => _chain.selected).map((_chain: ChainType) => _chain.label);
  //get accont
  const _getAccount = (chain: string) => new Promise((resolve, reject) => { });

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
    <MetamaskContext.Provider value={{ connectToMetamask, getBalanceWithMetamask }}>
      {children}
    </MetamaskContext.Provider>
  )
}

export default XChainProvider;

