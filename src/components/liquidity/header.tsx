"use client"
import React from 'react';
import { Dropdown } from 'flowbite-react';
import { Icon } from '@iconify/react';
import Image from "next/image";
import { useAtom } from "jotai";
//atoms
import {
  mainPoolsAtom,
  tokenPricesAtom
} from '@/store/swap';
//types
import { IPool } from '@/types/maya';
//data
import { TOKEN_DATA } from '@/utils/data';

interface IProps {
  fetchLPsInfo: () => Promise<void>,
  isFetching: boolean
}

const Header = ({ fetchLPsInfo, isFetching }: IProps) => {
  //atoms
  const [pools, ] = useAtom(mainPoolsAtom);
  const [tokenPrices, ] = useAtom(tokenPricesAtom);
  //state
  const [selectedPool, setSelectedPool] = React.useState<IPool | undefined>();

  /**
   * After fetching pools, set SelectedPool as first pool
   */
  React.useEffect(() => {
    if (pools.length > 0) {
      setSelectedPool(pools[0]);
    }
  }, [pools]);
  /**
   * fetch Liquidity providers information and my Liqudity
   */
  const refresh = () => {
    fetchLPsInfo ();
  }
  

  const _renderDropdownCollapse = () => (
    <div className='flex gap-2 grow-0'>
      <div className='text-lg'>
        { selectedPool && `${selectedPool.ticker} / CACAO` }
      </div>
      <div className='w-12 h-6 bg-[#F59E0B] flex items-center justify-center rounded-full cursor-pointer'>
        <Icon icon="iconamoon:arrow-down-2-duotone" width={24} className='text-white font-bold'/>
      </div>
    </div>
  )
  /**
   * render Pool Liquidity item
   * @returns ReactNode
   */
  const _renderPoolLiquidity = () => (
    <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0023] via-[#6d78b22d] to-[#e02d6f31]">
      <div className="rounded-2xl dark:bg-[#020202] bg-[#F3F7FC] dark:text-white h-full p-4">
        <div className='flex justify-between'>
          <div className='flex gap-1 items-center text-lg dark:text-[#BCBCBC] text-black'>
            <div className='p-1 rounded-full bg-[#2771f027]'>
              {
                selectedPool && 
                <Icon icon="uil:chart-down" width="1rem" height="1rem" className={Number(selectedPool.annualPercentageRate) > 0 ? 'text-[#22C55E]' : 'text-[#F15B5B]'} vFlip={Number(selectedPool.annualPercentageRate) > 0}/>
              }
              </div>
              Pool Liquidity
            </div>
            <div className='text-xs text-[#6978A0] dark:text-[#8D98AF]'>{Number(selectedPool?.annualPercentageRate) > 0 && '+'}{selectedPool && Number(Number(selectedPool.annualPercentageRate)*100).toFixed(2)}%</div>
          </div>
        <div className='text-md pt-1 dark:text-white text-[#8A8D92] text-wrap'>{selectedPool && (Number(selectedPool.assetDepth) / 10**8).toFixed(4)} {selectedPool?.ticker}</div>
        <div className='text-sm dark:text-[#8D98AF] text-[#6978A0]'>{selectedPool && (Number(selectedPool.assetDepth) * Number(selectedPool.assetPriceUSD) / 10**8).toFixed(4)} USDT</div>
      </div>
    </div>
  )
  /**
   * render MyLiqudity Component
   * @returns ReactNode
   */
  const _renderMyLiquidity = () => (
    <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0023] via-[#6d78b22d] to-[#e02d6f31]">
      <div className="rounded-2xl dark:bg-[#020202] bg-[#F3F7FC] dark:text-white h-full p-4">
        <div className='flex justify-between'>
          <div className='flex gap-1 items-center text-lg dark:text-[#BCBCBC] text-black'>
            <div className='p-1 rounded-full bg-[#2771f027]'>
              {
                selectedPool && 
                <Icon icon="uil:chart-down" width="1rem" height="1rem" className={Number(selectedPool.annualPercentageRate) > 0 ? 'text-[#22C55E]' : 'text-[#F15B5B]'} vFlip={Number(selectedPool.annualPercentageRate) > 0}/>
              }
            </div>
            My Liquidity
          </div>
          <div className='text-xs text-[#6978A0] dark:text-[#8D98AF]'>{Number(selectedPool?.annualPercentageRate) > 0 && '+'}{selectedPool && Number(Number(selectedPool.annualPercentageRate)*100).toFixed(2)}%</div>
        </div>
        <div className='text-md pt-1 dark:text-white text-[#8A8D92] text-wrap'>{selectedPool?.me ? (Number(selectedPool.me.asset_deposit_value) / 10**8).toFixed(4) : 0} {selectedPool?.ticker}</div>
        <div className='text-sm dark:text-[#8D98AF] text-[#6978A0]'>{selectedPool?.me ? (Number(selectedPool.me.asset_deposit_value) * Number(selectedPool.assetPriceUSD) / 10**8).toFixed(4) : 0} USDT</div>
      </div>
    </div>
  )
  /**
   * render 24h Liquidity
   * @returns ReactNode
   */
  const _render24hLiquidity = () => (
    <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0023] via-[#6d78b22d] to-[#e02d6f31]">
      <div className="rounded-2xl dark:bg-[#020202] bg-[#F3F7FC] dark:text-white h-full p-4">
        <div className='flex justify-between'>
          <div className='flex gap-1 items-center text-lg dark:text-[#BCBCBC] text-black'>
            <div className='p-1 rounded-full bg-[#2771f027]'>
              <Icon icon="mage:chart-up-fill" width="1rem" height="1rem"  className='text-[#2772F0]'/>
            </div>
            24h Liquidity
          </div>
          <div className='text-xs text-[#6978A0] dark:text-[#8D98AF]'>{Number(selectedPool?.annualPercentageRate) > 0 && '+'}{selectedPool && Number(Number(selectedPool.annualPercentageRate)*100).toFixed(2)}%</div>
        </div>
        <div className='text-md pt-1 dark:text-white text-[#8A8D92] text-wrap'>{selectedPool && (Number(selectedPool.volume24h) / Number(selectedPool.assetPrice) / 10**10).toFixed(4)} {selectedPool?.ticker}</div>
        <div className='text-sm dark:text-[#8D98AF] text-[#6978A0]'>{selectedPool && (Number(selectedPool.assetPriceUSD) * Number(selectedPool.volume24h) / Number(selectedPool.assetPrice) / 10**10).toFixed(4)} USDT</div>
      </div>
    </div>
  )

  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full grow">
      <div className="rounded-2xl px-5 py-6 bg-white dark:bg-[#0B0F16] dark:text-white flex flex-col lg:flex-row gap-3 lg:items-center relative">
        <div>
          <Dropdown label=""  renderTrigger={_renderDropdownCollapse}>
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
                  className='rounded-full'
                />
                <span>{_pool.ticker}</span>
                <span>/</span>
                <Image
                  src="/images/tokens/cacao.png"
                  width={25}
                  height={20}
                  alt={"cacao"}      
                />
                <span>CACAO</span>
              </Dropdown.Item>)
            }
          </Dropdown>
          <div className='text-md text-[#22C55E]'>
            0.000010394
          </div>
          <div className='text-sm'>$0.479249</div>
        </div>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-3 grow">
        { _renderPoolLiquidity() }
        { _renderMyLiquidity() }
        { _render24hLiquidity() }
        </div>
        <Icon onClick={refresh} icon="el:refresh" className={`mr-1 hover:opacity-50 cursor-pointer absolute right-2 top-3 ${isFetching && "spin"}`}/>
      </div>
    </div>
  )
}

export default Header;