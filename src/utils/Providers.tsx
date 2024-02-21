"use client";
import React from "react";
import { ThemeProvider } from "next-themes";
//wallet contexts
import XChainsProvider from "@/contexts/XChainContext";
import XDefiWalletProvider from '@/contexts/XDefiContext';
import MetamaskProvider from "@/contexts/MetamaskContext";
import AutoConnectProvider from "@/contexts/AutoConnectContext";
//notification
import NotificationProvider from "@/contexts/NotificationContext";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from '@ethersproject/providers';




function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const ThemeClient = ({ children }: Readonly<{ children: React.ReactNode }>) => {
 

  return (
    <ThemeProvider attribute="class" enableSystem={true}>
      <NotificationProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          <XChainsProvider>
            <XDefiWalletProvider>
              <MetamaskProvider>
                <AutoConnectProvider>
                  {children}
                </AutoConnectProvider>
              </MetamaskProvider>
            </XDefiWalletProvider>
          </XChainsProvider>
        </Web3ReactProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
};

export default ThemeClient;
