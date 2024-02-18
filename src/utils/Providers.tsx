"use client";
import React from "react";
import { ThemeProvider } from "next-themes";
import WalletContextProvider from "@/contexts/XChainsProvider";
import NotificationProvider from "@/contexts/NotificationContext";

const ThemeClient = ({ children }: Readonly<{ children: React.ReactNode }>) => (
  <ThemeProvider attribute="class" enableSystem={true}>
    <NotificationProvider>
      <WalletContextProvider>
        {children}
      </WalletContextProvider>
    </NotificationProvider>
  </ThemeProvider>
);

export default ThemeClient;
