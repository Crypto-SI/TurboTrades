"use client"
import React from "react";
import dynamic from "next/dynamic";
import axios from 'axios';
//atom
import {
  mainPoolsAtom,
  tokenPricesAtom,
  xBalancesAtom
} from '@/store';
//data
import {
  TOKEN_DATA
} from "@/utils/data";
//types
import { IPool, ILP } from '@/types/maya';
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
  const [xBalances, ] = useAtom(xBalancesAtom);

  /**
   * get Pools from Mayachain and store pool information
   */
  React.useEffect(() => {
    async function init () {
      try {
        const _prices: Record<string, string> = {};
        const _cacao = await axios.get("https://midgard.mayachain.info/v2/stats");
        const _address: string = xBalances["MAYA"]?.address;
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
        const _pools: IPool[] = await Promise.all(data.map(async(item: any) => {
          const { asset } = item;
          _prices[asset] =  item.assetPriceUSD; //token price with USD
          try {
            if (_address) {
              const { data } = await axios.get(`https://mayanode.mayachain.info/mayachain/pool/${asset}/liquidity_provider/${_address}`).catch(err => { throw undefined });
              throw data;
            } 
            throw undefined;
          } catch (result: any) {
            return { 
              ...item,
              token: TOKEN_DATA[asset].ticker,
              chain: TOKEN_DATA[asset].chain,
              image: TOKEN_DATA[asset].image,
              ticker: TOKEN_DATA[asset].ticker,
              name: TOKEN_DATA[asset].name,
              asset: asset,
              me: result
            }
          }
        }));
        console.log("@fetch lps from maya chain----------------", _pools);
        setMainPools (_pools);
        setTokenPrices(_prices);
      } catch (err) {
        console.log("@error fetching pools ------------------------", err);
      }
    }
    init ();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xBalances]);

  return (
    <div className="grow w-full md:pl-3">
      <Header/>
      { children }
    </div>
  );
};

export default Layout;
