"use client";
import React from "react";
//atoms
import { 
  walletListAtom, 
  walletAtom,
  isConnectingAtom,
  chainListAtom,
  xBalancesAtom,
  xDefiAddressesAtom,
  isWalletDetectedAtom
} from "@/store";
import { useAtom } from "jotai"; 
//types
import { ChainType, WalletType } from "@/types/minis"; 
//hooks
//hooks
// import useXChain from '@/hooks/useXChain';
import { useWeb3React } from "@web3-react/core";
import useXDefi from '@/hooks/useXDefiWallet';
import useMetamask from "@/hooks/useMetamask";

interface IAutoConnect {
  disconnectWallet: () => void
}
/**
 * AutoConnectContext
*/
export const AutoConnectContext = React.createContext<IAutoConnect|undefined>(undefined);

const AutoConnectProvider = ({children}: {children: React.ReactNode}) => {

  const { deactivate } = useWeb3React();

  // const { connectKeyStoreWallet } = useXChain ();
  const { connectToXDefi } = useXDefi();
  const { connectToMetamask } = useMetamask();
  const [ isFirst, setIsFirst ] = React.useState<boolean>(true);
  //atoms
  const [chainList, setChainList] = useAtom(chainListAtom);
  const [walletList, setWalletList] = useAtom(walletListAtom);
  const [, setWallet] = useAtom(walletAtom);
  const [, setXBalances] = useAtom(xBalancesAtom);
  const [, setXDefiAddresses] = useAtom(xDefiAddressesAtom);
  const [, setIsConnecting] = useAtom(isConnectingAtom);
  const [, setIsWalletDetected] = useAtom(isWalletDetectedAtom);

  const disconnectWallet = () => {
    deactivate();
    setXBalances({});
    setXDefiAddresses({});
    window.localStorage.removeItem("lastWallet");
    setChainList(chainList.map((chain: ChainType) => ({...chain, selected: false, focused: false})));
    setWalletList(walletList.map((wallet: WalletType) => ({...wallet, selected: false, focused: false})));
    setIsWalletDetected (false);
    setIsConnecting (false);
    setIsWalletDetected (false);
  }

  const _autoLogin = async (wallet: string) => {
    let _chains: string[] = [];
    if (wallet === "XDEFI") {
      setWallet({
        name: "XDEFI",
        image: "/images/wallets/xdefi.svg",
        supportedChains: ["BTC", "ETH", "MAYA", "KUJI", "THOR"],
        focused: false,
        selected: true
      });
      _chains = ["THOR", "MAYA", "ETH", "BTC", "KUJI"];
    } else if (wallet === "Metamask") {
      setWallet({
        name: "Metamask",
        image: "/images/wallets/xdefi.svg",
        supportedChains: ["ETH"],
        focused: false,
        selected: true
      });
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
    if (count > 0 && isFirst) {
      const wallet = window.localStorage.getItem("lastWallet");
      if (wallet === "XDEFI") {
        connectToXDefi ();
      } else if (wallet === "Metamask") {
        connectToMetamask ();
      }
      setIsFirst (false);
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
    <AutoConnectContext.Provider value={{disconnectWallet}}>
      { children }
    </AutoConnectContext.Provider>
  )
}

export default AutoConnectProvider;