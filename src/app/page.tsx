"use client"
import React from 'react';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import axios from "axios";
import Image from "next/image";
import { Icon } from '@iconify/react';
import SwapConfirm from '@/components/swap/swapConfirm';
//data
import {
  TOKEN_DATA, FEE_ESTIMATIONS, NATIVE_TOKENS
} from "@/utils/data";
//atoms
import {
  poolsAtom,
  fromTokenAtom,
  toTokenAtom,
  xBalancesAtom,
  QuoteSwapResponseAtom,
  tokenPricesAtom,
  walletAtom,
  isSwapingAtom
} from '@/store';
//types
import { IPool } from "@/types/maya";
import { IBalance } from "@/types/minis";
//utils
import { reduceAmount, _feeEstimation } from "@/utils/methods";
//hooks
import useNotification from "@/hooks/useNotification";
import useXChain from "@/hooks/useXChain";
import useXDefi from "@/hooks/useXDefiWallet";
import useMetamask from "@/hooks/useMetamask";
import { useRouter } from 'next/navigation'
//trxModal
import TransactionModal from "@/components/swap/transactionModal";
//components
import ProgressModal from '@/components/swap/progressModal/index';
const TokenSelector = dynamic(() => import("@/components/swap/tokenSelector"));

const Swap = () => {
  //stage and quoteSwapResponse
  const [pools, setPools] = useAtom(poolsAtom);
  const [quoteSwapResponse, setQuoteSwapResponse] = useAtom(QuoteSwapResponseAtom);
  //token prices Record <name, price>
  const [tokenPrices, setTokenPrices] = useAtom(tokenPricesAtom);
  const [wallet,] = useAtom(walletAtom);
  //token selector modal visible
  const [showFromTokens, setShowFromTokens] = React.useState<boolean>(false);
  const [showToTokens, setShowToTokens] = React.useState<boolean>(false);
  //my wallet balances
  const [xBalances,] = useAtom(xBalancesAtom);
  //token pairs
  const [fromToken, setFromToken] = useAtom(fromTokenAtom);
  const [toToken, setToToken] = useAtom(toTokenAtom);
  //amount
  const [fromAmount, setFromAmount] = React.useState<string>("");
  const [toAmount, setToAmount] = React.useState<string>("");
  //for showing error when estimating amount with API
  const [error, setError] = React.useState<string>("");
  const [isEstimating, setIsEstimating] = React.useState<boolean>(false);
  //hooks
  const { showNotification }  = useNotification ();
  const { doMayaSwap } = useXChain ();
  const { doXDefiSwap } = useXDefi ();
  const { doMetamaskSwap } = useMetamask ();
  const router = useRouter();
  //is swaping ..
  const [isSwaping, setIsSwaping] = React.useState<boolean>(false);
  //confirm Modal show
  const [showConfirmModal, setShowConfirmModal] = React.useState<boolean>(false);
  //progress Modal show
  const [showProgressModal, setShowProgressModal] = React.useState<boolean>(false);
  //hash
   const [hash, setHash] = React.useState<string>("https://sepolia.etherscan.io/tx/0xc1b6a7ef202cd6d8ac59968df9b930b4b2fc8acd7bfc837a25f68181ff01fb7a");
  /**
   * get Pools from Mayachain and store pool information
   */
  React.useEffect(() => {
    async function init () {
      try {
        const _prices: Record<string, string> = {};
        const _cacao = await axios.get("https://midgard.mayachain.info/v2/stats");
        const cacao: IPool = {
          annualPercentageRate: "",
          asset: "MAYA.CACAO",
          assetDepth: "",
          assetPrice: "",
          assetPriceUSD: _cacao.data.cacaoPriceUSD,
          liquidityUnits: "",
          nativeDecimal: "10",
          poolAPY: "",
          runeDepth: "",
          saversAPR: "",
          saversDepth: "",
          saversUnits: "",
          status: "",
          synthSupply: "",
          synthUnits: "",
          totalCollateral: "",
          totalDebtTor: "",
          units: "",
          volume24h: "",

          token: "CACAO",
          chain: "MAYA",
          name: "MAYA chain",
          ticker: "CACAO",
          image: TOKEN_DATA["MAYA.CACAO"].image,
          member: []
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
            asset: asset,
            member: []
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
            synth: true,
            member: []
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

  /**
   * set from amount as percent of balance with quick 25%, 50%, 75%, 100%
   * @param percent 
   */
  const _setPercentToSwap = (percent: number) => {
    try {
      if (!toToken || !fromToken) throw 0;
      if (Object.keys(xBalances).length === 0) throw 0;
      for (const key in xBalances) {
        xBalances[key].balance.forEach((balance: IBalance) => {
          if (fromToken.ticker === TOKEN_DATA[String(balance.asset)].ticker) throw balance.amount; //alternative
        })
      }
      throw 0;
    } catch (value) {
      setFromAmount(String(Number(value) * percent * 0.01));
    }
  }
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
          if (fromToken.ticker === TOKEN_DATA[String(balance.asset)].ticker) throw balance.amount;
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
          if (toToken.ticker === TOKEN_DATA[String(balance.asset)].ticker) throw balance.amount;
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
      setToAmount("0");
      return;
    }
    setFromAmount(value);
  }
  /**
   * Estimate inbound amount of token when pair and fromAmount is changed...
   */
  const _estimateAmount = async () => {
    setIsEstimating (true);
    
    const _decimals = (token: IPool) => {
      if (token?.chain === "MAYA" && !token?.synth) return 10**10;
      // if (chain === "KUJI") return 10**6;
      return 10**8;
    }

    let _des: string = "";
    const destination = xBalances[toToken?.chain as string];
    if (destination) {
      _des= `&destination=${destination.address}`
    }

    const decimals = _decimals(fromToken as IPool);
    let amount: any = Math.floor(Number(fromAmount)*decimals);
    amount = amount.toLocaleString('fullwide', {useGrouping:false});
    const { data } = await axios.get(`https://mayanode.mayachain.info/mayachain/quote/swap?from_asset=${fromToken?.asset}&to_asset=${toToken?.asset}&affiliate_bps=75&affiliate=maya&amount=${amount}${_des}`);
    if (data.error) {
      setError(data.error);
      setQuoteSwapResponse(undefined);
      setToAmount ("0");
    } else {
      const decimals = _decimals(toToken as IPool);
      setQuoteSwapResponse(data);
      const outBount: any = (Number(data.expected_amount_out) / decimals).toLocaleString('fullwide', {useGrouping:false});
      setToAmount(outBount);
      setError("");
    }
    setIsEstimating (false);
  }
  /**
   * hook for calculating estimated amount
   */
  React.useEffect(() => {
    // if from and to tokens are all available
    if (fromToken && toToken && Number(fromAmount) > 0) {
      _estimateAmount ();
    } else if (fromAmount === "") {
      setToAmount ("");
      setQuoteSwapResponse(undefined);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromAmount, fromToken, toToken]);
  /**
   * when cross button is clicked, exchange the target and destination...
   */
  const handleExchange = () => {
    const temp: IPool | undefined = fromToken;
    setFromToken (toToken);
    setToToken (temp);
    setFromAmount(toAmount);
  }
  /**
   * when fromToken is selected
   * @param token 
   */
  const handleSelectFromToken = (token: IPool) => {
    if (token.asset !== toToken?.asset) {
      setFromToken(token);
    }
  } 
  /**
   * when destination is selected
   * @param token 
   */
  const handleSelectToToken = (token: IPool) => {
    if (token.asset !== fromToken?.asset) {
      setToToken(token);
    }
  }
  /**
   * validate if sufficient fee is available...
   * @param _asset token asset to swap BTC.BTC, ETH.ETH....
   * @param _chain chain MAYA, ETH, BTC... 
   * @param _remain remaining token asset 0.001
   */
  const _isAvailableFee = async (_asset: string, _chain: string, _remain: number) => {
    const _fee: number = await _feeEstimation (_chain);

    if (NATIVE_TOKENS[_chain] === _asset) { // if current asset is native asset of chain.. ETH.ETH, DASH.DASH...
      console.log("@fee estimation ----------", _asset, { balance: _remain, require: _fee, gap: _remain - _fee });
      // return _remain > FEE_ESTIMATIONS[_chain];
      return _remain > _fee;
    } else {
      console.log("@fee estimation ----------", NATIVE_TOKENS[_chain], { balance: xBalances[_chain].balance[0].amount, require: _fee, gap: xBalances[_chain].balance[0].amount as number - _fee })
      return xBalances[_chain].balance[0].amount as number > _fee;
      // return xBalances[_chain].balance[0].amount as number > FEE_ESTIMATIONS[_chain];
    }
  }
  /**
   * handle Swap when click swap button (open confirm Modal)
   * @returns 
   */
  const handleSwap = async () => {

    if (isSwaping) return;
    try {
      if (Number(fromAmount) <= 0) throw "Please Input token amount to swap";
      if (error) throw "Can't swap as invaild setting.";
      if (!quoteSwapResponse) throw "Please confirm token pair and amount.";
      if (!xBalances[fromToken?.chain as string]) throw  `Please connect ${fromToken?.chain} chain.`;
      if (!xBalances[toToken?.chain as string]) throw  `Please connect ${toToken?.chain} chain.`;
      if (!quoteSwapResponse?.memo) throw `Please connect ${toToken?.chain} chain.`;

      const _balanceTemp = xBalances[String(fromToken?.chain)].balance.find((item: IBalance) => item.asset === String(fromToken?.asset).split("-")[0]);
      const _balance: number = _balanceTemp ? _balanceTemp.amount as number: 0;

      console.log(fromToken?.asset);
      if (fromToken?.asset === "DASH.DASH" || fromToken?.asset === "BTC.BTC") {
        if (Number(fromAmount) < 0.0001) throw "Amount to swap must be greater than the dust threshold value (0.0001). Don't set your transaction amount too low, as transactions that are too small may be refunded.";
      }
      console.log("@balance estimation ------------->", { balance: _balance, amount: fromAmount, gap: _balance - Number(fromAmount) });
      if (_balance < Number(fromAmount)) {
        throw "Insufficient Balance.";
      }
      if (!await _isAvailableFee(fromToken?.asset as string, fromToken?.chain as string, _balance - Number(fromAmount))) { // remain balance < estimatedFee
        throw `Insufficient fee for transaction.`;
      }
      
      // if (fromToken?.asset === "DASH.DASH" && Number(fromAmount) < 0.02) {
      //   throw "Recommend that you swap a afordable amount, it can be refunded. (0.02)"
      // }
      setShowConfirmModal(true);
    } catch (err) {
      showNotification (err, "info");
    }
  }
  /**
   * do swap using several kits
   */
  const submitSwap = async () => {
    try {
      setShowConfirmModal(false);
      setIsSwaping (true);
      console.log("@token pairs ------------------->", { fromToken, toToken });
      //do swap with several wallets
      if (wallet?.name === "Keystore") {
        await doMayaSwap (fromAmount, 75);
      } else if (wallet?.name === "XDEFI") {
        await doXDefiSwap (fromAmount);
      } else if (wallet?.name === "Metamask") {
        await doMetamaskSwap (fromAmount);
      }
    } catch (err) {
      showNotification (err, "info");
    } finally {
      setIsSwaping (false);
    }
  }

  return (
    <div className="flex-grow flex justify-center items-center sm:pl-0 md:pl-3">
      <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full lg:w-[460px]">
        { showConfirmModal && 
          <SwapConfirm 
            fromToken={fromToken}
            toToken={toToken}
            amount={fromAmount}
            onOK={submitSwap}
            onCancel={() => setShowConfirmModal(false)}
          /> 
        }
        {
          showProgressModal && fromToken && toToken &&
          <ProgressModal
            setVisible={setShowProgressModal}
            fromToken={fromToken}
            toToken={toToken}
            fromAmount={fromAmount}
            toAmount={toAmount}
            hash={hash}
          />
        }
        <TransactionModal />
        <button onClick={() => setShowProgressModal(true)} >asdf</button>
        <div className="rounded-2xl p-4 bg-white dark:bg-[#0A0C0F] text-[#8A8D92] dark:text-white">
          <div className="flex text-sm flex-wrap justify-between">
            {
              [25, 50, 75, 100].map((item: number) => <div onClick={() => _setPercentToSwap(item)} key={item} className={`cursor-pointer hover:opacity-60 w-[49%] mt-1 xxs:mt-0 xxs:w-[24%] bg-[#F3F7FC] text-black dark:text-white dark:bg-[#171A1F] border border-[#F3F7FC] dark:border-[#222832] p-5 rounded-xl flex items-center justify-center`}>{item}%</div>)
            }
          </div>
          <div className={`text-center text-black bg-[#FFC107] w-full rounded-xl mt-5 px-4 py-3 ${ !error && "hidden" }`}>
            { error.split(": unknown request")[0] }.
          </div>

          <div className="bg-[#F3F7FC] dark:text-[#8A8D92] dark:bg-[#030506] w-full rounded-2xl mt-3 px-4 py-5">
            <div className="flex justify-between">
              <h4 className="mb-2">Price</h4>
              <Icon onClick={_estimateAmount} icon="el:refresh" className={`mr-1 hover:opacity-50 cursor-pointer ${isEstimating && "spin"}`}/>
            </div>
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

          <div className="flex xxs:items-center gap-1 xxs:gap-5 mt-8 px-2 flex-col xxs:flex-row justify-between">
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
                  priority={true}   
                  alt={"toToken"}      
                  className="rounded-full"
                />
                <span className="dark:text-[#6978A0]">{toToken?.ticker}</span>
              </div>
            </div>
          </div>

          <div className="flex xxs:items-center gap-1 xxs:gap-5 mt-2 px-2 flex-col xxs:flex-row text-sm justify-between">
            <span className="text-[#C5C7CC] dark:text-[#C5C7CC]">Amount:&nbsp;</span>
            <span className="dark:text-[#6978A0]">{fromAmount ? fromAmount : "0"} {fromToken?.ticker} ({toAmount ? toAmount : "0"} {toToken?.ticker})</span>
          </div>

          <div className="flex xxs:items-center gap-1 xxs:gap-5 mt-2 px-2 flex-col xxs:flex-row justify-between">
            <span className="text-[#C5C7CC] dark:text-[#C5C7CC]">Affiliate Fee:&nbsp;</span>
            <span className="dark:text-[#6978A0] text-sm">{toAmount ? reduceAmount(Number(toAmount) *0.0075) : "0"} {toToken?.ticker} ({quoteSwapResponse ? reduceAmount(Number(toToken?.assetPriceUSD) * Number( Number(toAmount)* 0.0075 )) : "0"} $)</span>
          </div>
          <div className="flex xxs:items-center gap-1 xxs:gap-5 mt-2 px-2 flex-col xxs:flex-row justify-between">
            <span className="text-[#C5C7CC] dark:text-[#C5C7CC]">Outbound Fee:&nbsp;</span>
            <span className="dark:text-[#6978A0] text-sm">{quoteSwapResponse ? reduceAmount(Number(quoteSwapResponse.fees.outbound) / 10**8) : "0"} {toToken?.ticker} ({quoteSwapResponse ? reduceAmount(Number(toToken?.assetPriceUSD) * Number(quoteSwapResponse.fees.outbound) / 10**8) : "0"} $)</span>
          </div>
          {
            Object.keys(xBalances).length > 0 ? 
            <button onClick={() => handleSwap()} data-tooltip-target="tooltip-default" className="flex justify-center items-center gap-3 text-white mt-7 p-5 w-full rounded-xl bg-gradient-to-r from-[#FF6802] to-[#EE0E72] hover:from-[#ff6702de] hover:to-[#ee0e739f]">
              { isSwaping ? <div className="flex items-center gap-2"><Icon icon="icomoon-free:spinner9" className="spin"/>Swapping...</div> : "Swap" }
            </button> :
            <button onClick={() => router.push("/connect-wallet")} data-tooltip-target="tooltip-default" className="flex justify-center items-center gap-3 text-white mt-7 p-5 w-full rounded-xl bg-gradient-to-r from-[#FF6802] to-[#EE0E72] hover:from-[#ff6702de] hover:to-[#ee0e739f]">
              Connect Wallet
            </button>
          }
        </div>
      </div>
    </div>
  )
}

export default Swap;