"use client"
import React from 'react';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import axios from "axios";
//components
const WalletConnect = dynamic(() => import("@/components/swap/walletConnect"));
const Swap = dynamic(() => import('@/components/swap/swap'));
//atom
import {
  stageAtom,
  fromTokenAtom,
  toTokenAtom,
  poolsAtom
} from '@/store';
//data
import {
  TOKEN_DATA
} from "@/utils/data";
//utils
import { splitToAsset } from '@/utils/methods';
//types
import { IPool } from '@/utils/types';

const Home = () => {
  
  const [pools, setPools] = useAtom(poolsAtom);
  const [stage, setStage] = useAtom(stageAtom);
  const [fromToken, setFromToken] = useAtom(fromTokenAtom);
  const [toToken, setToToken] = useAtom(toTokenAtom);

  //get pools
  React.useEffect(() => {
    async function init () {
      try {
        const _cacao = await axios.get("https://midgard.mayachain.info/v2/stats");
        const cacao: IPool = {
          assetPriceUSD: _cacao.data.cacaoPriceUSD,
          asset: "MAYA.CACAO",
          token: "CACAO",
          chain: "MAYA",
          ticker: "CACAO",
          image: TOKEN_DATA["MAYA.CACAO"].image,
        }

        const { data } = await axios.get("https://midgard.mayachain.info/v2/pools");
        const _pools: IPool[] = data.map((item: any) => {
          let { asset, token } = splitToAsset(item.asset);
          return {
            ...item,
            token,
            chain: TOKEN_DATA[asset].name,
            image: TOKEN_DATA[asset].image,
            ticker: token
          }
        });
        setFromToken(cacao);
        setToToken(_pools[0]);
        setPools ([cacao, ..._pools]);
      } catch (err) {
        console.log("err fetching pools ------------------------>", err);
      }
    }
    init ();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="flex-grow flex justify-center items-center">
      { stage === "swap" && <Swap/> }
      { stage === "wallet" && <WalletConnect/> }
    </div>
  )
}

export default Home;