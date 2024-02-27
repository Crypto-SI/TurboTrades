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
  poolsAtom,
  tokenPricesAtom
} from '@/store';
//data
import {
  TOKEN_DATA
} from "@/utils/data";
//utils

//types
import { IPool } from '@/types/maya';

const Home = () => {
  
  const [pools, setPools] = useAtom(poolsAtom);
  const [stage, setStage] = useAtom(stageAtom);
  const [fromToken, setFromToken] = useAtom(fromTokenAtom);
  const [toToken, setToToken] = useAtom(toTokenAtom);
  const [tokenPrices, setTokenPrices] = useAtom(tokenPricesAtom);

  /**
   * get Pools from Mayachain and store pool information
   */
  React.useEffect(() => {
    async function init () {
      try {
        const _prices: Record<string, string> = {};
        const _cacao = await axios.get("https://midgard.mayachain.info/v2/stats");
        const cacao: IPool = {
          assetPriceUSD: _cacao.data.cacaoPriceUSD,
          asset: "MAYA.CACAO",
          token: "CACAO",
          chain: "MAYA",
          name: "MAYA chain",
          ticker: "CACAO",
          image: TOKEN_DATA["MAYA.CACAO"].image,
          nativeDecimal: "10"
        }
        _prices["MAYA.CACAO"] =  _cacao.data.cacaoPriceUSD; //cacao token price with USD

        const { data } = await axios.get("https://midgard.mayachain.info/v2/pools");
        console.log("@fetched pools from maya ---------------------", data);
        const _pools: IPool[] = data.map((item: any) => {
          const { asset } = item;
          _prices[asset] =  item.assetPriceUSD; //token price with USD
          return {
            ...item,
            token: TOKEN_DATA[asset].ticker,
            chain: TOKEN_DATA[asset].chain,
            image: TOKEN_DATA[asset].image,
            ticker: TOKEN_DATA[asset].ticker,
            name: TOKEN_DATA[asset].name,
            asset: asset
          }
        });
        const _synPools: IPool[] = data.map((item: any) => {
          const { asset } = item;
          _prices[asset.replace(".", "/")] =  item.assetPriceUSD; //token price with USD
          return {
            ...item,
            token: "s" + TOKEN_DATA[asset].ticker,
            chain: "MAYA",
            image: TOKEN_DATA[asset].image,
            ticker: "s" + TOKEN_DATA[asset].ticker,
            name: TOKEN_DATA[asset].name,
            asset: asset.replace(".", "/"),
            synth: true
          }
        });
        setTokenPrices(_prices);
        setFromToken(cacao);
        setToToken(_pools[0]);
        setPools ([cacao, ..._pools, ..._synPools]);
      } catch (err) {
        console.log("@error fetching pools ------------------------", err);
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