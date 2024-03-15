"use client"
import React from 'react';
import Image from "next/image";
import { Icon } from '@iconify/react';
import { Dropdown } from 'flowbite-react';
import { useAtom } from "jotai";
import axios from 'axios';
//atoms
import {
  mainPoolsAtom,
  tokenPricesAtom,
  xBalancesAtom,
  walletAtom
} from '@/store';
//types
import { IPool } from '@/types/maya';
import { IBalance } from '@/types/minis';
//data
import { TOKEN_DATA, NATIVE_TOKENS, SUB_LINKS } from '@/utils/data';
//methods
import { reduceAmount, _feeEstimation } from '@/utils/methods';
//components
import AddLiquidityConfirm from '@/components/liquidity/add/addLiquidityConfirm';
import AddLiquidityResult from "@/components/liquidity/add/addLiquidityResult";
import { Tabs } from 'flowbite-react';
//hooks
import useNotification from "@/hooks/useNotification";
import useXChain from "@/hooks/useXChain";
import useXDefi from "@/hooks/useXDefiWallet";
import useMetamask from "@/hooks/useMetamask";
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const AddLiquidity = () => {
  //router & params
  const router = useRouter();
  const searchParams = useSearchParams ();
  const asset = searchParams.get("asset");
  const pathname = usePathname ();
  //atoms
  const [pools, ] = useAtom(mainPoolsAtom);
  const [xBalances, ] = useAtom(xBalancesAtom);
  const [wallet,] = useAtom(walletAtom);
  //state
  const [selectedPool, setSelectedPool] = React.useState<IPool | undefined>();
  const [mode, setMode] = React.useState<string>("asym");
  const [amount, setAmount] = React.useState<string>("");
  const [selectedTokenPrice, setSelectedTokenPrice] = React.useState<string>("0");
  const [showConfirmModal, setShowConfirmModal] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showResultModal, setShowResultModal] = React.useState<boolean>(false);
  const [tnxUrl, setTnxUrl] = React.useState<string>("https://vercel.app");
  const [txResult, setTxResult] = React.useState<{ hash?:string, url?:string, err?: string }[]>([]);
  //hooks
  const { showNotification } = useNotification ();
  const { xChainAddLiquidity } = useXChain ();
  const { xDefiAddLiquidity } = useXDefi ();
  /**
   * when click switch button, sym -> asym, asym -> sym
   * @returns 
   */
  const handleSwitchMode = () => {
    setMode(mode === "sym" ? "asym" : "sym");
  }
  /**
   * when token amount to deposit is changed
   * @param e 
   * @returns 
   */
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    //@ts-ignore
    if (Number(value) < 0 || isNaN(Number(value)) || value.length > 15) {
      return;
    }
    setAmount(value);
  }
  /**
   * when token amount is changed, calculate it's value...
   */
  React.useEffect(() => {
    if ( selectedPool ) {
      const _price = Number(amount) * Number(selectedPool?.assetPriceUSD);
      setSelectedTokenPrice(reduceAmount(_price));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, selectedPool]);
  /**
   * @when asset is change, set the selectedPool
   */
  React.useEffect(() => {
    const pool = pools.find((_pool: IPool) => _pool.asset === asset);
    setSelectedPool(pool);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, pools]);
  /**
   * render balance
   * @returns 
   */
  const _balance = () => React.useMemo(() => {
    try {
      if (Object.keys(xBalances).length === 0 || !selectedPool) return "0";
      for (const key in xBalances) {
        xBalances[key].balance.forEach((balance: IBalance) => {
          if (selectedPool.ticker === TOKEN_DATA[String(balance.asset)].ticker) throw balance.amount;
        })
      }
      throw "0";
    } catch (value) {
      return value;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xBalances, selectedPool]);
  /**
   * render Pool selector
   * @returns 
   */
  const _renderPoolSelector = () => (
    <div className='w-1/3 flex justify-center items-center p-2 rounded-xl dark:bg-[#111317] border dark:border-[#1B2028] gap-2 cursor-pointer hover:opacity-50'>
      Pool<Icon icon="iconamoon:arrow-down-2-duotone" width={24} className='text-white font-bold'/>
    </div>
  )
  /**
   * set amount as balance
   */
  const handleSetMax = () => {
    try {
      if (Object.keys(xBalances).length === 0 || !selectedPool) return "0";
      for (const key in xBalances) {
        xBalances[key].balance.forEach((balance: IBalance) => {
          if (selectedPool.ticker === TOKEN_DATA[String(balance.asset)].ticker) throw balance.amount;
        })
      }
      throw "0";
    } catch (value) {
      setAmount (String(value));
    }
  }
  /**
   * add liquidity
   */
  const onAddLiquidity = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    try {
      const { data } = await axios.get(`https://mayanode.mayachain.info/mayachain/inbound_addresses`);

      const _inbountAddress = data.find((item: any) => item.chain === selectedPool?.chain);//inbound address
      if (!_inbountAddress) throw "None inbound address";
      
      const address = xBalances[selectedPool?.chain as string]?.address;
      const mayaAddress = xBalances['MAYA']?.address;
      
      if (!address) throw "Please connect current chain.";
      if (!mayaAddress) throw "Please connect Maya chain.";

      // const nativeDecimal = Number(selectedPool?.nativeDecimal) === -1 ? 8 : Number(selectedPool?.nativeDecimal);
      const nativeDecimal = TOKEN_DATA[selectedPool?.asset as string].decimals;
      let response: { hash?:string, err?: string }[] = [];
      //add liquidity with several wallets...
      if (wallet?.name === "Keystore") {
        response = await xChainAddLiquidity ({
          asset: String(selectedPool?.asset),
          decimals: nativeDecimal,
          amount: Number(amount),
          recipient: _inbountAddress.address,
          address: address,
          mayaAddress: mayaAddress,
          mode: mode
        });
      } else if (wallet?.name === "XDEFI") {
        response = await xDefiAddLiquidity ({
          asset: String(selectedPool?.asset),
          decimals: nativeDecimal,
          amount: Number(amount),
          recipient: _inbountAddress.address,
          address: address,
          mayaAddress: mayaAddress,
          mode: mode
        });
      } else if (wallet?.name === "Metamask") {
        // await doMetamaskSwap (fromAmount);
      }
      
      console.log("@resonse with add liquidity -----------------", response);
      const hash = response[0].hash;
      const _target = mode === "sym" ?
        `/progress/liquidity/add?hash=${hash}&from=${address}&in=${selectedPool?.asset}&out=MAYA.CACAO&ina=${amount}&outa=${Number(amount)*Number(selectedPool?.assetPrice)}&start=1709893536993` :
        `/progress/liquidity/add?hash=${hash}&from=${address}&in=${selectedPool?.asset}&ina=${amount}&start=1709893536993`;
      router.push(_target);
    } catch (err) {
      if (String(err).includes("insufficient funds for intrinsic transaction cost")) {
        showNotification("Insufficient funds for intrinsic transaction cost.", "warning");
      } else {
        showNotification(String(err), "warning");
      }
    } finally {
      setIsLoading(false);
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
   * when click add liquidity button
   */
  const handleAddLiquidityClick = async () => {
    // return setShowConfirmModal(true);

    if (isLoading) return;
    // setShowConfirmModal(true);
    try {
      if (Number(amount) <= 0) throw "Please Input token amount to swap";
      if (!xBalances[selectedPool?.chain as string]) throw  `Please connect ${selectedPool?.chain} chain.`;
      if (!xBalances["MAYA"]) throw `Please connet MAYA chain.`;   
      
      const _balanceTemp = xBalances[String(selectedPool?.chain)].balance.find((item: IBalance) => item.asset === String(selectedPool?.asset).split("-")[0]);
      const _balance: number = _balanceTemp ? _balanceTemp.amount as number: 0;

      if (selectedPool?.asset === "DASH.DASH" || selectedPool?.asset === "BTC.BTC") {
        if (Number(amount) < 0.0001) throw "Amount to swap must be greater than the dust threshold value (0.0001). Don't set your transaction amount too low, as transactions that are too small may be refunded.";
      }
      console.log("@balance estimation ------------->", { balance: _balance, amount: amount, gap: _balance - Number(amount) });
      if (_balance < Number(amount)) {
        throw "Insufficient Balance.";
      }
      if (!await _isAvailableFee(selectedPool?.asset as string, selectedPool?.chain as string, _balance - Number(amount))) { // remain balance < estimatedFee
        throw `Insufficient fee for transaction.`;
      }
      if (mode === "sym") {
        const _amount: number = Number(amount)*Number(selectedPool?.assetPrice);
        const _balanceTemp = xBalances["MAYA"].balance[0].amount;
        const _balance: number = _balanceTemp ? _balanceTemp as number: 0;

        console.log("@cacao balance estimation ------------->", { balance: _balance, amount: _amount, gap: _balance - _amount });
        if (_balance < _amount) {
          throw "Insufficient CACAO Balance.";
        }
        if (!await _isAvailableFee("MAYA.CACAO", "MAYA", _balance - _amount)) { // remain balance < estimatedFee
          throw `Insufficient CACAO fee for transaction.`;
        }
      }
      setShowConfirmModal(true);
    } catch (err) {
      showNotification (err, "info");
    }
  }
  /**
   * render SubLink item
   * @param label 
   * @param url 
   * @returns ReactNode
   */
  const _renderSubLink = (label: string, url: string) => (
    <button onClick={() => router.push(`${url}?asset=${asset}`)} key={label} className={`dark:bg-[#111214] bg-white text-[12px] py-[5px] px-3 rounded-lg text-gray-400 hover:dark:text-white hover:dark:bg-black hover:opacity-50 ${pathname === url && 'border  dark:!text-white dark:border-[#cccccc3b] border-[#4b434370] !text-black'}`}>
      {label}
    </button>
  )
  
  

  return (
    <div className="flex grow flex-col mt-2">
      { showConfirmModal && 
        <AddLiquidityConfirm 
          onOK={onAddLiquidity}
          onCancel={() => setShowConfirmModal(false)}
          pool={selectedPool as IPool}
          amount={amount}  
          mode={mode}
        /> 
      }
      {
        showResultModal &&
        <AddLiquidityResult
          onOK={() => setShowResultModal(false)}
          pool={selectedPool as IPool}
          amount={amount}  
          txResult={txResult}
          mode={mode}
        />
      }
      <div className='flex gap-1'>
        {SUB_LINKS.map(({ label, url }: { label: string, url: string }) => _renderSubLink(label, url))}
      </div>
      <div className='flex flex-col w-full justify-center items-center  mt-2 lg:mt-20'>
        <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full lg:w-[600px]">
          <div className="rounded-2xl p-3 pt-4 bg-white dark:bg-[#0A0C0F] dark:text-white">  
            <div className='flex text-sm lg:gap-0 gap-2 lg:space-x-2 lg:flex-row flex-col'>
              <div className='flex space-x-2 lg:w-2/3'>
                <div className='w-2/3 justify-center items-center flex p-3 rounded-xl dark:bg-[#111317] border dark:border-[#1B2028] gap-2'>
                  <Image
                    src={selectedPool ? String(selectedPool.image) : '/images/tokens/cacao.png'}
                    width={25}
                    height={20}
                    alt={"sun"} 
                    priority={true}     
                    className='rounded-full'
                  />
                  <span className='xxs:flex hidden'>{ selectedPool && selectedPool.ticker }</span>
                  <span>/</span>
                  <Image
                    src="/images/tokens/cacao.png"
                    width={25}
                    height={20}
                    alt={"sun"} 
                    priority={true}      
                  />
                  <span className='xxs:flex hidden'>CACAO</span>
                </div>
                <Dropdown label=""  renderTrigger={_renderPoolSelector}>
                  <Dropdown.Item>Liquidity Pools</Dropdown.Item>
                  <Dropdown.Divider />
                  {
                    pools.map((_pool: IPool) => 
                    <Dropdown.Item key={_pool.asset} onClick={() => router.push(`${pathname}?asset=${_pool.asset}`)} className='flex gap-2 !text-sm'>
                      <Image
                        src={ _pool.image as string }
                        width={25}
                        height={20}
                        alt={"sun"} 
                        priority={true}      
                        className='rounded-full'
                      />
                      <span>{_pool.ticker}</span>
                      <span>/</span>
                      <Image
                        src="/images/tokens/cacao.png"
                        width={25}
                        height={20} 
                        priority={true}
                        alt={"cacao"}      
                      />
                      <span>CACAO</span>
                    </Dropdown.Item>)
                  }
                </Dropdown>
                
              </div>
              <div className='w-full lg:w-1/3 flex p-2 justify-center items-center rounded-xl dark:bg-[#111317] border dark:border-[#1B2028] gap-2'>
                <Image
                  src="/images/chart.svg"
                  width={25}
                  height={25}
                  alt={"sun"} 
                  priority={true}      
                />
                <span className='text-[#2ABA3C]'>APR</span><span className='text-[#2ABA3C] font-bold'>{Number(selectedPool?.annualPercentageRate) > 0 && '+'}{ selectedPool && (Number(selectedPool.annualPercentageRate) * 100).toFixed(2) }%</span>
              </div>
            </div>

            <div className="w-full p-4 dark:text-[#ffffffa1] dark:bg-[#030506] bg-[#F3F7FC] rounded-2xl mt-3">
              <div className='flex justify-between items-center'>
                <div className='flex gap-3 text-lg items-center'>
                  <Image
                    src={selectedPool ? String(selectedPool.image) : '/images/tokens/cacao.png'}
                    width={40}
                    height={40}
                    alt={"sun"} 
                    priority={true}      
                    className='rounded-full'
                  />
                  { selectedPool?.ticker }
                </div>
                <div className='flex gap-2 items-center'>
                  <span className='text-[#2ABA3C] text-[1rem]'>APR</span>
                  <span className='text-[#2ABA3C] text-lg'>:</span>
                  <span className='text-xl font-bold text-[#2ABA3C]'>{Number(selectedPool?.annualPercentageRate) > 0 && '+'}{ selectedPool && (Number(selectedPool.annualPercentageRate) * 100).toFixed(2) }%</span>
                </div>
              </div>

              <div className='flex text-[15px] flex-col xs:flex-row gap-2 mt-3 justify-between'>
                <div className='flex flex-col xs:flex-row items-center justify-between dark:bg-[#0a0f14] grow bg-white border border-[#DCE4EF] dark:border-[#3341558e] rounded-xl p-[6px]'>
                  <div className='w-full xs:w-auto text-[#8A8D92] dark:text-[#B0B7C3] pl-3 text-sm'>Amount:</div>
                  <input
                    onChange={handleAmountChange}
                    value={amount}
                    placeholder="0.0"
                    className="grow px-2 bg-transparent rounded-[12px] w-full outline-none border-none" 
                  />
                  <div className='px-2 w-full xs:w-auto'>{selectedTokenPrice}$</div>
                  <div onClick={handleSetMax} className='w-full xs:w-auto dark:bg-[#0a0f14] bg-[#E2E6EB] border border-[#DCE4EF] dark:border-[#3341558e] cursor-pointer hover:opacity-50 rounded-lg p-2 text-[12px]'>MAX</div>
                </div>
                { 
                  mode === "asym" && 
                  <button onClick={handleAddLiquidityClick} className='text-white flex justify-center items-center rounded-xl bg-gradient-to-r from-[#FF6802] to-[#EE0E72] p-3 w-full xs:w-[100px] cursor-pointer hover:opacity-50'>
                    {
                      !isLoading ? "Add" :
                      <Icon icon="icomoon-free:spinner9" width={25} className="spin"/>
                    }
                  </button> 
                }
              </div>
              <div className='py-1 px-2 text-sm'>Balance: { reduceAmount(_balance()) } {selectedPool?.ticker}</div>

              <button onClick={handleSwitchMode} className='flex text-sm items-center justify-center hover:opacity-50 cursor-pointer mt-10 bg-[#131822] text-[#B0B7C3] dark:text-[#B0B7C3] gap-2 p-3 rounded-xl w-full dark:bg-[#0F161F]'>
                Add two sided
                <Icon icon="iconamoon:arrow-down-2-duotone" width={24} className='text-white font-bold'/>
              </button>
            </div>
          </div>
        </div>

        {
          mode === "sym" &&  
          <>
            <div className="relative my-6 border-dashed border-b border-[#00000059] dark:border-[#ffffff4f] w-full lg:w-[600px]">
              <div className="absolute flex items-center justify-center w-12 h-12 border-8 border-[#F3F7FC] dark:border-[#030506] rounded-full left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#8f7676] dark:bg-[#131822]">
                <Icon onClick={handleSwitchMode} icon="tdesign:swap" className="text-white hover:opacity-50 cursor-pointer arrow-rotate" rotate={1}/>
              </div>
            </div>

            <div className="rounded-2xl p-3 pt-4 bg-white dark:bg-[#0A0C0F] dark:text-white md:mt-0 w-full lg:w-[600px] border border-dashed dark:border-[#F2215A]">
              <div className="w-full p-4 dark:text-[#ffffffa1] dark:bg-[#0F161F] bg-[#F3F7FC] rounded-2xl border dark:border-[#33415583]">
                <div className='flex items-center gap-2'>
                  <Image
                    src="/images/tokens/cacao.png"
                    width={40}
                    height={40}
                    alt={"sun"} 
                    priority={true}      
                  />
                  CACAO
                </div>

                <div className='flex flex-col xs:flex-row gap-1 mt-4 items-center justify-between dark:bg-[#0a0f14] grow bg-white border border-[#DCE4EF] dark:border-[#3341558e] rounded-xl p-[6px]'>
                  <div className='w-full xs:w-auto text-[#8A8D92] dark:text-[#B0B7C3] pl-3 text-sm'>Amount:</div>
                  <input
                    placeholder="0.0"
                    disabled
                    value={reduceAmount(Number(amount)*Number(selectedPool?.assetPrice))}
                    className="grow px-2 bg-transparent py-2 rounded-[12px] w-full outline-none border-none" 
                  />
                  <div className='px-2 w-full xs:w-auto'>{selectedTokenPrice}$</div>
                </div>
                <div className='py-1 px-2  text-sm'>Balance: { reduceAmount(xBalances["MAYA"]?.balance[0]?.amount) } CACAO</div>
                <button onClick={handleAddLiquidityClick} className='text-white text-sm mt-4 rounded-xl bg-gradient-to-r from-[#FF6802] to-[#EE0E72] p-4 w-full cursor-pointer hover:opacity-50'>
                  {
                    !isLoading ? "Add Liquidity" :
                    <div className="flex items-center gap-2 justify-center"><Icon icon="icomoon-free:spinner9" className="spin"/>Processing...</div>
                  }
                </button>
              </div>
            </div>
          </>
        }
      </div>
    </div>
  )
}

export default AddLiquidity;