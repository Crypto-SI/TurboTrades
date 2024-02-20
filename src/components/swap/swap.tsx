"use client";
import React from "react";
import Image from "next/image";
import { Icon } from '@iconify/react';
import { useAtom } from 'jotai';
import axios from 'axios';
import dynamic from "next/dynamic";
//data
import {
  TOKEN_DATA
} from "@/utils/data";
//atoms
import {
  stageAtom,
  poolsAtom,
  fromTokenAtom,
  toTokenAtom,
  xBalancesAtom,
  QuoteSwapResponseAtom,
  tokenPricesAtom
} from '@/store';
//types
import { IPool } from "@/types/maya";
import BigNumber from 'bignumber.js';
import { IBalance } from "@/types/minis";
//components
const TokenSelector = dynamic(() => import("@/components/swap/tokenSelector"));
//utils
import { reduceAmount } from "@/utils/methods";

const Swap = () => {
  //pools in Maya chain
  const [pools, setPools] = useAtom(poolsAtom);
  //stage and quoteSwapResponse
  const [stage, setStage] = useAtom(stageAtom);
  const [quoteSwapResponse, setQuoteSwapResponse] = useAtom(QuoteSwapResponseAtom);
  //token prices Record <name, price>
  const [tokenPrices, setTokenPrices] = useAtom(tokenPricesAtom);
  //token selector modal visible
  const [showFromTokens, setShowFromTokens] = React.useState<boolean>(false);
  const [showToTokens, setShowToTokens] = React.useState<boolean>(false);
  //my wallet balances
  const [xBalances, setXBalances] = useAtom(xBalancesAtom);
  //token pairs
  const [fromToken, setFromToken] = useAtom(fromTokenAtom);
  const [toToken, setToToken] = useAtom(toTokenAtom);
  //amount
  const [fromAmount, setFromAmount] = React.useState<string>("");
  const [toAmount, setToAmount] = React.useState<string>("");
  //for showing error when estimating amount with API
  const [error, setError] = React.useState<string>("");

  /**
   * calculate src balance
   * @returns string
   */
  const _fromBalance = () => React.useMemo(() => {
    try {
      if (!toToken || !fromToken) return "";
      if (Object.keys(xBalances).length === 0) throw "0";
      for (const key in xBalances) {
        xBalances[key].balance.forEach((balance: IBalance) => {
          if (fromToken.ticker === balance.ticker) throw balance.amount;
        })
      }
      throw "0";
    } catch (value) {
      let src = reduceAmount(value);
      let quote: any = Number(value) * (Number(tokenPrices[String(fromToken?.asset)])/Number(tokenPrices[String(toToken?.asset)]));
      quote = reduceAmount(quote);
      return `${src}${fromToken?.ticker} (${quote}${toToken?.ticker})`;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xBalances, fromToken, toToken]);
  /**
   * calculate destination balance
   * @returns string
   */
  const _toBalance = () => React.useMemo(() => {
    try {
      if (!toToken || !fromToken) return "";
      if (Object.keys(xBalances).length === 0) throw "0";
      for (const key in xBalances) {
        xBalances[key].balance.forEach((balance: IBalance) => {
          if (toToken.ticker === balance.ticker) throw balance.amount;
        });
      }
      throw "0";
    } catch (value) {
      let src = reduceAmount(value as number);
      let quote: any = Number(value) * (Number(tokenPrices[String(toToken?.asset)])/Number(tokenPrices[String(fromToken?.asset)]));
      quote = reduceAmount(quote);
      return `${src}${toToken?.ticker} (${quote}${fromToken?.ticker})`;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xBalances, fromToken, toToken]);
  /**
   * when typing token amount to swap
   * @param e 
   * @returns 
   */
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    //@ts-ignore
    if (Number(value) < 0 || isNaN(Number(value)) || value.length > 15) {
      return;
    }
    setFromAmount(value);
  }
  //calculate estimated amount for swaping
  const _estimateAmount = async () => {
    let src = "", des = "";
    if (Object.keys(xBalances).length === 0) {
      src="";
      des="";//&destination=kujira1cd5kzygxfzylez8q4vak55pwj2z7a6hweat0zw
    } else {

    }

    const decimals = fromToken?.ticker === "CACAO" ? 10**10 : 10**8;
    let amount: any = Number(fromAmount)*decimals;
    amount = amount.toLocaleString('fullwide', {useGrouping:false});
    const { data } = await axios.get(`https://mayanode.mayachain.info/mayachain/quote/swap?from_asset=${fromToken?.asset}&to_asset=${toToken?.asset}&amount=${amount}`);
    if (data.error) {
      setError(data.error);
    } else {
      const decimals = toToken?.ticker === "CACAO" ? 10**10 : 10**8;
      setQuoteSwapResponse(data);
      const outBount: any = (Number(data.expected_amount_out) / decimals).toLocaleString('fullwide', {useGrouping:false});
      setToAmount(outBount);
      setError("");
    }
  }
  //hook for calculating estimated amount
  React.useEffect(() => {
    // if (fromToken && toToken) {
    if (fromToken && toToken && Number(fromAmount) > 0) {
      _estimateAmount ();
    } else if (fromAmount === "") {
      setToAmount ("");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromAmount, fromToken, toToken]);

  const handleExchange = () => {
    const temp: IPool = { ...fromToken };
    setFromToken ({ ...toToken });
    setToToken ({ ...temp });
    setFromAmount(toAmount);
  }
  //when source token is selected
  const handleSelectFromToken = (token: IPool) => {
    if (token.asset !== toToken?.asset) {
      setFromToken(token);
    }
  } 
  //when destination is selected
  const handleSelectToToken = (token: IPool) => {
    if (token.asset !== fromToken?.asset) {
      setToToken(token);
    }
  }

  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full md:w-[calc(100vw-360px)] lg:w-[460px]">
      <div className="rounded-2xl p-4 bg-white dark:bg-[#0A0C0F] text-[#8A8D92] dark:text-white">
        <div className="flex text-sm flex-wrap justify-between">
          {
            ["25", "50", "75", "100"].map((item: string) => <div key={item} className="w-[49%] mt-1 xxs:mt-0 xxs:w-[24%] bg-[#F3F7FC] text-black dark:text-white dark:bg-[#171A1F] border border-[#F3F7FC] dark:border-[#222832] p-5 rounded-xl flex items-center justify-center">{item}%</div>)
          }
        </div>
        <div className={`text-center text-black bg-[#FFC107] w-full rounded-xl mt-5 px-4 py-3 ${ !error && "hidden" }`}>
          { error.split(": unknown request")[0] }.
        </div>

        <div className="bg-[#F3F7FC] dark:text-[#8A8D92] dark:bg-[#030506] w-full rounded-2xl mt-3 px-4 py-5">
          <h4 className="mb-2">Price</h4>
          <div className="relative bg-white dark:bg-[#0A0D13] hover:bg-[#4b3b3b05] hover:dark:bg-black cursor-pointer border border-[#F3F7FC] dark:border-[#222832] w-full p-3 rounded-xl flex items-center justify-between">
            {
              fromToken ? 
              <div onClick={() => { setShowFromTokens(true) }} className="flex items-center gap-3">
                <Image
                  src={fromToken.image + ""}
                  width={50}
                  height={50}
                  alt={"sun"}      
                  priority={true}
                  className='rounded-full'
                />
                { fromToken.ticker }
                <Icon icon="ep:arrow-down-bold" width={17} vFlip={showFromTokens as boolean}/>
              </div> : 
              <div className="w-20 h-12 bg-gray-300 dark:bg-slate-900 rounded-full animate-pulse"></div>
            }
            <div  className="grow pl-3">
              <input
                onChange={handleAmountChange}
                disabled={!fromToken}
                placeholder="0.0"
                value={fromAmount}
                className="bg-transparent py-4 rounded-[12px] w-full outline-none text-right border-none" 
              />
            </div>
            <TokenSelector setToken={handleSelectFromToken} visible={showFromTokens} setVisible={setShowFromTokens}/>
          </div>
          <div className="mt-2 text-sm flex justify-between px-1">
            <div>
              <span className="text-[#A4A8B2] dark:text-white">Balance:</span> 
              <span className="text-[#6978A0] dark:text-[#6978A0]"> { _fromBalance() }</span>
            </div>
            <span>{reduceAmount(Number(fromAmount) * Number(fromToken?.assetPriceUSD))}$</span>
          </div>

          <div className="relative mt-6 border-dashed border-b border-[#00000059] dark:border-[#ffffff4f]">
            <div onClick={handleExchange} className="absolute flex items-center justify-center w-12 h-12 border-8 border-[#F3F7FC] dark:border-[#030506] rounded-full left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#8f7676] dark:bg-[#131822]">
              <Icon icon="tdesign:swap" className="text-white hover:opacity-50 cursor-pointer arrow-rotate" rotate={1}/>
            </div>
          </div>

          <h4 className="mb-2 mt-5">Amount</h4>
          <div className="relative bg-white dark:bg-[#0A0D13] hover:bg-[#4b3b3b05] hover:dark:bg-black cursor-pointer border border-[#F3F7FC] dark:border-[#222832] w-full p-3 rounded-xl flex items-center justify-between">
            {
              toToken ? 
              <div onClick={() => {setShowToTokens(true)}} className="flex items-center gap-3">
                <Image
                  src={ toToken.image + "" }
                  width={50}
                  height={50}
                  alt={"sun"}      
                  priority={true}
                  className='rounded-full'
                />
                { toToken.ticker }
                <Icon icon="ep:arrow-down-bold" width={17} vFlip={showToTokens as boolean}/>
              </div> : 
              <div className="w-20 h-12 bg-gray-300 dark:bg-slate-900 rounded-full animate-pulse"></div>
            }
            <div  className="grow pl-3">
              <input
                disabled
                value={toAmount}
                placeholder="0.0"
                className="bg-transparent py-4 rounded-[12px] w-full outline-none text-right border-none" 
              />
            </div>
            <TokenSelector setToken={handleSelectToToken} visible={showToTokens} setVisible={setShowToTokens}/>
          </div>
          <div className="mt-2 text-sm flex justify-between px-1">
            <div>
              <span className="text-[#A4A8B2] dark:text-white">Balance:</span> 
              <span className="text-[#6978A0] dark:text-[#6978A0]"> { _toBalance() }</span>
            </div>
            <span>{reduceAmount(Number(toAmount) * Number(toToken?.assetPriceUSD))}$</span>
          </div>
        </div>

        <div className="flex xxs:items-center gap-1 xxs:gap-5 mt-8 px-1 flex-col xxs:flex-row">
          <span className="text-[#C5C7CC] dark:text-[#C5C7CC]">Currency: </span>
          <div className="flex gap-4 items-center">
            <div className="flex gap-2">
              <Image
                src={fromToken ? String(fromToken.image) : "/images/tokens/btc.webp"}
                width={24}
                height={24}
                alt={"fromToken"}      
                priority={true}
                className="rounded-full"
              />
              <span className="dark:text-[#6978A0]">{fromToken?.ticker}</span>
            </div>
            <Icon icon="tdesign:swap" />
            <div className="flex gap-2">
              <Image
                src={toToken ? String(toToken.image) : "/images/tokens/btc.webp"}
                width={24}
                height={24}
                alt={"toToken"}      
                priority={true}
                className="rounded-full"
              />
              <span className="dark:text-[#6978A0]">{toToken?.ticker}</span>
            </div>
          </div>
        </div>

        <div className="flex xxs:items-center gap-1 xxs:gap-5 mt-2 px-1 flex-col xxs:flex-row">
          <span className="text-[#C5C7CC] dark:text-[#C5C7CC]">Amount:&nbsp;</span>
          <span className="dark:text-[#6978A0]">{fromAmount ? fromAmount : "0"} {fromToken?.ticker} ({toAmount ? toAmount : "0"} {toToken?.ticker})</span>
        </div>

        <button onClick={() => setStage("wallet")} data-tooltip-target="tooltip-default" className="flex justify-center items-center gap-3 text-white mt-7 p-5 w-full rounded-xl bg-gradient-to-r from-[#FF6802] to-[#EE0E72] hover:from-[#ff6702de] hover:to-[#ee0e739f]">
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default Swap;
