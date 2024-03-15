"use client"
import React from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
// import LiquidityChart from '@/components/liquidity/liquidityCard';
const LiqudityChart  = dynamic(() => import("@/components/liquidity/liquidityCard"), { ssr: false });
const Header = dynamic(() => import("@/components/liquidity/liquiditiesHeader"), {ssr:false});
//atoms
import { 
  mainPoolsAtom,
  tokenPricesAtom,
  xBalancesAtom 
} from "@/store";
//data
import {
  TOKEN_DATA,
  LIQUIDITY_SORT_CONDS
} from "@/utils/data";
//types
import { IPool, ILP, IMemberPool, IDepthPriceHistory } from '@/types/maya';
//hooks
import { useAtom } from 'jotai';


const Liqudity = () => {
  //atoms
  const [mainPools, setMainPools] = useAtom(mainPoolsAtom);
  const [tokenPrices, setTokenPrices] = useAtom(tokenPricesAtom);
  const [xBalances, ] = useAtom(xBalancesAtom);
  //states
  const [isFetching, setIsFetching] = React.useState<boolean>(false);
  const [keyword, setKeyword] = React.useState<string>("");
  const [onlyMyPools, setOnlyMyPools] = React.useState<boolean>(false);
  const [sort, setSort] = React.useState<string>(LIQUIDITY_SORT_CONDS[0].label);

  // React.useEffect(() => {
  //   if (onlyMyPools) {
  //     setMainPools(mainPools.filter((_pool: IPool) => _pool.member.length > 0));
  //   }
  // }, [onlyMyPools]);

  const _filter = (_pool: IPool) => {
    try {
      if (!_pool.asset.toLocaleLowerCase().includes(keyword)) throw "no keyword"; //keyword filter
      if (onlyMyPools && _pool.member.length === 0) throw "not my pool"; //my pool filter
      return true;
    } catch (err) {
      return false;
    }
  }

  const _sort = (_prev: IPool, _cur: IPool) => {
    let _value = false;
    switch (sort) {
      case "Highest Price": {
        _value = Number(_cur.assetPriceUSD) > Number(_prev.assetPriceUSD);
        break;
      }
      case "Lowest Price": {
        _value = Number(_cur.assetPriceUSD) < Number(_prev.assetPriceUSD);
        break;
      }
      case "Highest Liquidity": {
        _value = Number(_cur.assetDepth) < Number(_prev.assetDepth);
        break;
      }
      case "Lowest Liquidity": {
        _value = Number(_cur.assetDepth) > Number(_prev.assetDepth);
        break;
      }
      case "Alphabetical": {
        _value = String(_cur.ticker) < String(_prev.ticker);
        break;
      }
      case "Highest APR": {
        _value = Number(_cur.annualPercentageRate) > Number(_prev.annualPercentageRate);
        break;
      }
      case "Lowest APR": {
        _value = Number(_cur.annualPercentageRate) < Number(_prev.annualPercentageRate);
        break;
      }
    }
    return _value ? 1 : -1;
  } 



  return (
    <div className="grow w-full pt-2">
      <Header 
        keyword={keyword} 
        setKeyword={setKeyword}
        onlyMyPools={onlyMyPools}
        setOnlyMyPools={setOnlyMyPools}
        sort={sort}
        setSort={setSort}
      />
      <div className='w-full grid card-xl:grid-cols-4 card-lg:grid-cols-3 card-md:grid-cols-2 grid-cols-1 gap-3 mt-2'>
        { mainPools.filter(_filter).sort(_sort).map((_pool: IPool, index: number) => <LiqudityChart key={index} pool={_pool}/>) }
      </div>
    </div>
  )
}

export default Liqudity;