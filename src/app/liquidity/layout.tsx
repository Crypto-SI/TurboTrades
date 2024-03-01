"use client"
import React from "react";
import dynamic from "next/dynamic";
import axios from 'axios';
//atom
import {
  mainPoolsAtom,
  tokenPricesAtom
} from '@/store';
//data
import {
  TOKEN_DATA
} from "@/utils/data";
//types
import { IPool } from '@/types/maya';
//hooks
import { useAtom } from 'jotai';

const Header = dynamic(() => import("@/components/liquidity/header"), { 
  ssr: false,
  // loading: () => <SiderLoader/> 
});
const Layout: React.FC<{children: React.ReactNode}> = ({children}: {children: React.ReactNode}) => {
  //atoms
  const [, setMainPools] = useAtom(mainPoolsAtom);
  const [tokenPrices, setTokenPrices] = useAtom(tokenPricesAtom);

  /**
   * get Pools from Mayachain and store pool information
   */
  React.useEffect(() => {
    async function init () {
      try {
        const _prices: Record<string, string> = {};
        const _cacao = await axios.get("https://midgard.mayachain.info/v2/stats");
        // const cacao: IPool = {
        //   assetPriceUSD: _cacao.data.cacaoPriceUSD,
        //   asset: "MAYA.CACAO",
        //   token: "CACAO",
        //   chain: "MAYA",
        //   name: "MAYA chain",
        //   ticker: "CACAO",
        //   image: TOKEN_DATA["MAYA.CACAO"].image,
        //   nativeDecimal: "10"
        // }
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
        console.log("@set main pools ---------------------", _pools);
        setMainPools (_pools);
        setTokenPrices(_prices);
      } catch (err) {
        console.log("@error fetching pools ------------------------", err);
      }
    }
    init ();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grow w-full md:pl-3">
      <Header/>
      { children }
    </div>
  );
};

export default Layout;
