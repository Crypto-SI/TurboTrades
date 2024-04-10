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
  SUPPORTED_POOLS,
  TOKEN_DATA
} from "@/utils/data";
//types
import { IPool, ILP, IMemberPool, IDepthPriceHistory } from '@/types/maya';
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
  //states
  const [isFetching, setIsFetching] = React.useState<boolean>(false);

  const fetchLPsInfo = async() => {
    try {
      setIsFetching (true);
      const _prices: Record<string, string> = {};
      const _cacao = await axios.get("https://midgard.mayachain.info/v2/stats");
      const _mayaAddress: string = xBalances["MAYA"]?.address;
      _prices["MAYA.CACAO"] =  _cacao.data.cacaoPriceUSD; //cacao token price with USD
      const { data } = await axios.get("https://midgard.mayachain.info/v2/pools");
      const _pools: IPool[] = await Promise.all(data.filter((_pool: any) => SUPPORTED_POOLS.includes(_pool.asset)).map(async(item: any) => {
        
        const { asset } = item;
        _prices[asset] =  item.assetPriceUSD; //token price with USD
        const _address = xBalances[TOKEN_DATA[asset].chain]?.address;
        const _result: IPool =  { 
          ...item,
          token: TOKEN_DATA[asset].ticker,
          chain: TOKEN_DATA[asset].chain,
          image: TOKEN_DATA[asset].image,
          ticker: TOKEN_DATA[asset].ticker,
          name: TOKEN_DATA[asset].name,
          asset: asset,
        }

        try {
          const _timestamp = Math.floor(new Date().getTime() / 1000);
          const { data } = await axios.get(`https://midgard.mayachain.info/v2/history/depths/${asset}?interval=day&count=30&to=${_timestamp}`);
          _result["depthHistory"] = data.intervals;
        } catch (err) { console.log("@err while fetching depth history -----------", err) }

        try {
          if (!_address) throw []; 
          // const { data } = await axios.get(`https://mayanode.mayachain.info/mayachain/pool/${asset}/liquidity_provider/${_address}`).catch(err => { throw undefined });
          const { data } = await axios.get(`https://midgard.mayachain.info/v2/member/${_address}`).catch(err => { throw [] });
          // throw data.pools;
          throw data.pools.filter((_pool: IMemberPool) => _pool.pool === asset);
        } catch (result: any) { 
          _result["member"] = result;
        }
        return _result;
      }));
      console.log("@fetch lps from maya chain----------------", _pools);
      setMainPools (_pools);
      setTokenPrices(_prices);
    } catch (err) {
      console.log("@error fetching pools ------------------------", err);
    } finally {
      setIsFetching (false);
    }
  }
  /**
   * get Pools from Mayachain and store pool information
   */
  React.useEffect(() => {

    fetchLPsInfo ();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xBalances]);

  return (
    <div className="grow w-full md:pl-3">
      <Header fetchLPsInfo={fetchLPsInfo} isFetching={isFetching}/>
      { children }
    </div>
  );
};

export default Layout;
