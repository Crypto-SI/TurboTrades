"use client"
import React from 'react';
import WalletConnect from "@/components/swap/walletConnect";
import Swap from '@/components/swap/swap';
import { useAtom } from 'jotai';

import {
  stageAtom
} from '@/store';

const Home = () => {

  const [stage, setStage] = useAtom(stageAtom);

  return (
    <div className="flex-grow flex justify-center items-center">
      { stage === "swap" && <Swap/> }
      { stage === "wallet" && <WalletConnect/> }
    </div>
  )
}

export default Home;