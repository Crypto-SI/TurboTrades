"use client"
import React from 'react';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';

const WalletConnect = dynamic(() => import("@/components/swap/walletConnect"));
const Swap = dynamic(() => import('@/components/swap/swap'));

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