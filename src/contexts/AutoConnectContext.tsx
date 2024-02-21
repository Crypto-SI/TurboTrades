"use client";
import React from "react";
//atoms
import { chainListAtom } from "@/store";
import { useAtom } from "jotai"; 
//types
import { ChainType } from "@/types/minis"; 
//hooks
//hooks
// import useXChain from '@/hooks/useXChain';
import useXDefi from '@/hooks/useXDefiWallet';
import useMetamask from "@/hooks/useMetamask";

/**
 * AutoConnectContext
*/
export const AutoConnectContext = React.createContext<undefined>(undefined);

const AutoConnectProvider = ({children}: {children: React.ReactNode}) => {

  // const { connectKeyStoreWallet } = useXChain ();
  const { connectToXDefi } = useXDefi();
  const { connectToMetamask } = useMetamask();

  const [chainList, setChainList] = useAtom(chainListAtom);
  const _autoLogin = async (wallet: string) => {
    let _chains: string[] = [];
    if (wallet === "XDEFI") {
      _chains = ["THOR", "MAYA", "ETH", "BTC", "KUJI"];
    } else if (wallet === "Keystore") {
      _chains = ["THOR", "MAYA", "ETH", "BTC", "KUJI", "DASH"];
    } else if (wallet === "Metamask") {
      _chains = ["ETH"];
    }
    setChainList(chainList.map((chain:ChainType) => ({
      ...chain,
      selected: _chains.indexOf(chain.label) == -1 ? false: true,
      focused: _chains.indexOf(chain.label) == -1 ? false: true
    })));
  }

  React.useEffect(() => {
    const count = chainList.reduce((count, item:ChainType) => item.selected ? count + 1 : count, 0);
    if (count > 0) {
      // console.log(chainList.reduce((count, item: ChainType) => item.selected ? count + 1 : count, 0));
      const wallet = window.localStorage.getItem("lastWallet");
      if (wallet === "XDEFI") {
        connectToXDefi ();
      } else if (wallet === "Metamask") {
        connectToMetamask ();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainList])

  React.useEffect(() => {
    const wallet = window.localStorage.getItem("lastWallet");
    if (wallet) {
      _autoLogin (wallet);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AutoConnectContext.Provider value={undefined}>
      { children }
    </AutoConnectContext.Provider>
  )
}

export default AutoConnectProvider;