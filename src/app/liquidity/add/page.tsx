"use client"
import React from 'react';
import Image from "next/image";
import { Icon } from '@iconify/react';
import { Dropdown } from 'flowbite-react';
import { useAtom } from "jotai";
//atoms
import {
  mainPoolsAtom,
  tokenPricesAtom,
  xBalancesAtom
} from '@/store';
//types
import { IPool } from '@/types/maya';
import { IBalance } from '@/types/minis';
//data
import { TOKEN_DATA } from '@/utils/data';
//methods
import { reduceAmount } from '@/utils/methods';
//components
import AddLiquidityConfirm from '@/components/liquidity/addLiquidityConfirm';


const AddLiquidity = () => {
  //atoms
  const [pools, ] = useAtom(mainPoolsAtom);
  const [xBalances, ] = useAtom(xBalancesAtom);
  //state
  const [selectedPool, setSelectedPool] = React.useState<IPool | undefined>();
  const [mode, setMode] = React.useState<string>("asym");
  const [amount, setAmount] = React.useState<string>("");
  const [selectedTokenPrice, setSelectedTokenPrice] = React.useState<string>("0");
  const [showConfirmModal, setShowConfirmModal] = React.useState<boolean>(false);
  /**
   * After fetching pools, set SelectedPool as first pool
   */
  React.useEffect(() => {
    if (pools.length > 0) {
      setSelectedPool(pools[0]);
    }
  }, [pools]);
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
    <div className='w-1/3 flex justify-center items-center p-4 rounded-xl dark:bg-[#111317] border dark:border-[#1B2028] gap-2 cursor-pointer hover:opacity-50'>
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
  const onAddLiquidity = () => {
    setShowConfirmModal(false);
  }
  /**
   * when click add liquidity button
   */
  const handleAddLiquidityClick = () => {
    setShowConfirmModal(true);
  }

  return (
    <div className="flex grow justify-center items-center mt-20 flex-col">
      { showConfirmModal && 
        <AddLiquidityConfirm 
          onOK={onAddLiquidity}
          onCancel={() => setShowConfirmModal(false)}
          pool={selectedPool as IPool}
          amount={amount}  
          mode={mode}
        /> 
      }
      <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full lg:w-[600px]">
        <div className="rounded-2xl p-3 pt-4 bg-white dark:bg-[#0A0C0F] dark:text-white">  
          <div className='flex lg:gap-0 gap-2 lg:space-x-2 lg:flex-row flex-col'>
            <div className='flex space-x-2 lg:w-2/3'>
              <div className='w-2/3 justify-center items-center flex p-4 rounded-xl dark:bg-[#111317] border dark:border-[#1B2028] gap-2'>
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
                  <Dropdown.Item key={_pool.asset} onClick={() => setSelectedPool(_pool)} className='flex gap-2'>
                    <Image
                      src={ _pool.image as string }
                      width={25}
                      height={20}
                      alt={"sun"}      
                      priority={true}
                      className='rounded-full'
                    />
                    <span className='xxs:flex hidden'>{_pool.ticker}</span>
                    <span>/</span>
                    <Image
                      src="/images/tokens/cacao.png"
                      width={25}
                      height={20}
                      alt={"cacao"}      
                      priority={true}
                    />
                    <span className='xxs:flex hidden'>CACAO</span>
                  </Dropdown.Item>)
                }
              </Dropdown>
              
            </div>
            <div className='w-full lg:w-1/3 flex p-4 justify-center items-center rounded-xl dark:bg-[#111317] border dark:border-[#1B2028] gap-2'>
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
              <div className='flex gap-3 text-xl items-center'>
                <Image
                  src={selectedPool ? String(selectedPool.image) : '/images/tokens/cacao.png'}
                  width={50}
                  height={50}
                  alt={"sun"}      
                  priority={true}
                  className='rounded-full'
                />
                { selectedPool?.ticker }
              </div>
              <div className='flex gap-2 items-center'>
                <span className='text-[#2ABA3C] text-lg'>APR</span>
                <span className='text-[#2ABA3C] text-lg'>:</span>
                <span className='text-2xl font-bold text-[#2ABA3C]'>{Number(selectedPool?.annualPercentageRate) > 0 && '+'}{ selectedPool && (Number(selectedPool.annualPercentageRate) * 100).toFixed(2) }%</span>
              </div>
            </div>

            <div className='flex flex-col xs:flex-row gap-2 mt-3 justify-between'>
              <div className='flex flex-col xs:flex-row items-center justify-between dark:bg-[#0a0f14] grow bg-white border border-[#DCE4EF] dark:border-[#3341558e] rounded-xl p-[6px]'>
                <div className='w-full xs:w-auto text-[#8A8D92] dark:text-[#B0B7C3] pl-3'>Amount:</div>
                <input
                  onChange={handleAmountChange}
                  value={amount}
                  placeholder="0.0"
                  className="grow px-2 bg-transparent rounded-[12px] w-full outline-none border-none" 
                />
                <div className='px-2 w-full xs:w-auto'>{selectedTokenPrice}$</div>
                <div onClick={handleSetMax} className='w-full xs:w-auto dark:bg-[#0a0f14] bg-[#E2E6EB] border border-[#DCE4EF] dark:border-[#3341558e] cursor-pointer hover:opacity-50 rounded-xl p-2 text-sm'>MAX</div>
              </div>
              { mode === "asym" && <button onClick={handleAddLiquidityClick} className='text-white rounded-xl bg-gradient-to-r from-[#FF6802] to-[#EE0E72] p-3 w-full xs:w-[100px] cursor-pointer hover:opacity-50'>ADD</button> }
            </div>
            <div className='py-1 px-2'>Balance: { reduceAmount(_balance()) } {selectedPool?.ticker}</div>

            <button onClick={handleSwitchMode} className='flex items-center justify-center hover:opacity-50 cursor-pointer mt-10 bg-[#131822] text-[#B0B7C3] dark:text-[#B0B7C3] gap-2 p-3 rounded-xl w-full dark:bg-[#0F161F]'>
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
            <div className="w-full p-4 dark:text-[#ffffffa1] dark:bg-[#0F161F] bg-[#F3F7FC] rounded-2xl mt-3 border dark:border-[#33415583]">
              <div className='flex items-center gap-2'>
                <Image
                  src="/images/tokens/cacao.png"
                  width={50}
                  height={50}
                  alt={"sun"}      
                  priority={true}
                />
                CACAO
              </div>

              <div className='flex flex-col xs:flex-row gap-1 mt-4 items-center justify-between dark:bg-[#0a0f14] grow bg-white border border-[#DCE4EF] dark:border-[#3341558e] rounded-xl p-[6px]'>
                <div className='w-full xs:w-auto text-[#8A8D92] dark:text-[#B0B7C3] pl-3'>Amount:</div>
                <input
                  placeholder="0.0"
                  disabled
                  value={reduceAmount(Number(amount)*Number(selectedPool?.assetPrice))}
                  className="grow px-2 bg-transparent py-2 rounded-[12px] w-full outline-none border-none" 
                />
                <div className='px-2 w-full xs:w-auto'>{selectedTokenPrice}$</div>
              </div>
              <div className='py-1 px-2'>Balance: { reduceAmount(xBalances["MAYA"]?.balance[0]?.amount) } CACAO</div>
              <button onClick={handleAddLiquidityClick} className='text-white mt-4 rounded-xl bg-gradient-to-r from-[#FF6802] to-[#EE0E72] p-3 w-full cursor-pointer hover:opacity-50'>Add Liquidity</button>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default AddLiquidity;