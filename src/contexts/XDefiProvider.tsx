"use client"
import React from "react";
import { useAtom } from "jotai";


import {
  xClientsAtom, xClientLoadingAtom,
  isConnectingAtom,
  chainListAtom,
  xBalancesAtom
} from "@/store";

import { ChainType, XClients, XBalances, IBalance, IWallet } from "@/utils/types";
import { NATIVE_TOKENS } from "@/utils/data";

interface IXDefiContext {
  connectToXDefi: (phrase: string) => Promise<void>,
  getBalances: () => Promise<void>
}

/**
 * XDefiContext
*/
export const XDefiContext = React.createContext<IXDefiContext | undefined>(undefined);

const XChainProvider = ({ children }: { children: React.ReactNode }) => {

  const [xClients, setXClients] = useAtom(xClientsAtom);
  const [xBalances, setXBalances] = useAtom(xBalancesAtom);
  const [xClientLoading, setXClientLoading] = useAtom(xClientLoadingAtom);
  const [chainList,] = useAtom(chainListAtom);
  const [isConnecting, setIsConnecting] = useAtom(isConnectingAtom);
  //chains that is selected at this moment
  const chains = React.useMemo(() => chainList.filter((_chain: ChainType) => _chain.selected).map((_chain: ChainType) => _chain.label), [chainList]);

  const connectToXDefi = async () => {

  }

  const getBalances = async () => {

  }

  return (
    <XDefiContext.Provider value={{ connectToXDefi, getBalances }}>
      {children}
    </XDefiContext.Provider>
  )
}

export default XChainProvider;