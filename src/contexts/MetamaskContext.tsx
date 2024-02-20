"use client"

import React from "react";
import { useAtom } from "jotai";
import { ethers } from 'ethers';
import axios from 'axios';
import { ETHERSCAN_API_KEY } from "@/config"; 


import {
  isConnectingAtom,
  chainListAtom,
  xBalancesAtom,
  xDefiAddressesAtom
} from "@/store";
//types
import { ChainType, XClients, XBalances, IBalance, IWallet } from "@/types/minis";
//data
import { NATIVE_TOKENS } from "@/utils/data";
//context type
interface IMetamaskContext {
  connectToMetamask: () => Promise<void>,
  getBalanceWithMetamask: () => Promise<void>
}

import { _getPrices } from "./XChainsProvider";
/**
 * MetamaskContext
*/
export const MetamaskContext = React.createContext<IMetamaskContext | undefined>(undefined);

const XChainProvider = ({ children }: { children: React.ReactNode }) => {

  const [xBalances, setXBalances] = useAtom(xBalancesAtom);
  const [chainList,] = useAtom(chainListAtom);
  const [isConnecting, setIsConnecting] = useAtom(isConnectingAtom);
  const [xDefiAddresses, setXDefiAddresses] = useAtom(xDefiAddressesAtom);
  //chains that is selected at this moment
  const chains = chainList.filter((_chain: ChainType) => _chain.selected).map((_chain: ChainType) => _chain.label);
  //get accont
  const _getAccount = (chain: string) => new Promise((resolve, reject) => {})

  const connectToMetamask = async () => {
    console.log("asdfasdf")
  }

  const getBalanceWithMetamask = async () => {

  }

  return (
    <MetamaskContext.Provider value={{ connectToMetamask, getBalanceWithMetamask }}>
      {children}
    </MetamaskContext.Provider>
  )
}

export default XChainProvider;

