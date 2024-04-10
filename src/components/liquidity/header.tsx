"use client"
import React from 'react';
import { Dropdown } from 'flowbite-react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Image from "next/image";
import { useAtom } from "jotai";
//atoms
import {
  mainPoolsAtom,
  tokenPricesAtom
} from '@/store/swap';
//types
import { IPool, IMemberPool } from '@/types/maya';
//data
import { TOKEN_DATA } from '@/utils/data';
//router
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { reduceAddress, reduceAmount } from '@/utils/methods';

interface IProps {
  fetchLPsInfo: () => Promise<void>,
  isFetching: boolean
}

const Header = ({ fetchLPsInfo, isFetching }: IProps) => {
  //router
  const router = useRouter ();
  const pathname = usePathname ();
  const searchParams = useSearchParams (); // liquidity/add/ETH.ETH
  const asset = searchParams.get("asset");
  //atoms
  const [pools, ] = useAtom(mainPoolsAtom);
  const [tokenPrices, ] = useAtom(tokenPricesAtom);
  //state
  const [selectedPool, setSelectedPool] = React.useState<IPool | undefined>();
  /**
   * fetch Liquidity providers information and my Liqudity
   */
  const refresh = () => {
    fetchLPsInfo ();
  }
  /**
   * render DropDown Item
   * @returns React.ReactNode
   */
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
   * when the url's asset is changed...
   */
  React.useEffect(() => {
    if (pools.length > 0) {
      if (asset) {
        setSelectedPool(pools.find((_pool:IPool) => _pool.asset === asset));
      } else {
        setSelectedPool(pools[0]);
      }
    }
  }, [asset, pools]);
  /**
   * when use change the pool
   * @param _asset 
   */
  const handleChangePool = (_asset: string) => {
    router.push(`${pathname}?asset=${_asset}`);
  }
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
          <div className='text-md pt-1 dark:text-white text-[#8A8D92] text-wrap flex gap-1 items-center'>
            <span className='text-[#22C55E] '>{selectedPool && (Number(selectedPool.assetDepth) / 10**8).toFixed(4)}</span> 
            <span className='text-sm'>{selectedPool?.ticker}</span>
          </div>
        <div className='text-sm dark:text-[#8D98AF] text-[#6978A0]'>{selectedPool && (Number(selectedPool.assetDepth) * Number(selectedPool.assetPriceUSD) / 10**8).toFixed(4)} USDT</div>
      </div>
    </div>
  )
  /**
   * render MyLiqudity Component
   * @returns ReactNode
   */
  const _renderMyLiquidity = () => {

    const _symPool = selectedPool?.member.find((_pool: IMemberPool) => Number(_pool.runeAdded) !== 0);
    const _asymPool = selectedPool?.member.find((_pool: IMemberPool) => Number(_pool.runeAdded) === 0);

    const _poolUnits = selectedPool?.units??0;
    const _assetDepth = selectedPool?.assetDepth??0; 
    const _symUnits = _symPool?.liquidityUnits??0;
    const _asymUnits = _asymPool?.liquidityUnits??0;

    const _symAsset = Number(_symUnits * Number(_assetDepth) / Number(_poolUnits)) / 1e8;
    const _asymAsset = Number(2 * _asymUnits * Number(_assetDepth) / Number(_poolUnits)) / 1e8;

    return (
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
          <div className='text-md pt-1 dark:text-white text-[#8A8D92] text-wrap'>
            { _symPool && <><span className='text-[#22C55E]'>{ reduceAmount(_symAsset, 3) }</span> <span className='text-sm'>{ selectedPool?.ticker }</span> / <span className='text-[#22C55E]'>{ reduceAmount(Number(_symAsset) * Number(selectedPool?.assetPrice), 3) }</span> <span className='text-sm'>CACAO</span></> }
          </div>
          <div className='text-md dark:text-white text-[#8A8D92] text-wrap'>
            { _asymPool && <><span className='text-[#22C55E]'>{ reduceAmount(_asymAsset, 3) }</span> <span className='text-sm'>{ selectedPool?.ticker }</span> / <span className='text-[#22C55E]'>0</span> <span className='text-sm'>CACAO</span></> }
          </div>
          {/* <div className='text-sm dark:text-[#8D98AF] text-[#6978A0]'>{selectedPool ? (assetDeposit * Number(selectedPool.assetPriceUSD) / 10**8).toFixed(4) : 0} USDT</div> */}
        </div>
      </div>
    )
  }
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
            24h Volume
          </div>
          <div className='text-xs text-[#6978A0] dark:text-[#8D98AF]'>{Number(selectedPool?.annualPercentageRate) > 0 && '+'}{selectedPool && Number(Number(selectedPool.annualPercentageRate)*100).toFixed(2)}%</div>
        </div>
        <div className='text-md pt-1 dark:text-white text-[#8A8D92] text-wrap flex gap-1 items-center'>
          <span className='text-[#22C55E] '>{selectedPool && (Number(selectedPool.volume24h) / Number(selectedPool.assetPrice) / 10**10).toFixed(4)}</span> 
          <span className='text-sm'>{selectedPool?.ticker}</span>
        </div>
        <div className='text-sm dark:text-[#8D98AF] text-[#6978A0]'>{selectedPool && (Number(selectedPool.assetPriceUSD) * Number(selectedPool.volume24h) / Number(selectedPool.assetPrice) / 10**10).toFixed(4)} USDT</div>
      </div>
    </div>
  )

  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full grow">
      <div className="rounded-2xl px-5 py-3 bg-white dark:bg-[#0B0F16] dark:text-white flex flex-col lg:flex-row gap-3 lg:items-center relative">
        <div>
          <Dropdown label=""  renderTrigger={_renderDropdownCollapse}>
            <Dropdown.Item>Liquidity Pools</Dropdown.Item>
            <Dropdown.Divider />
            {
              pools.map((_pool: IPool) => 
              <Dropdown.Item key={_pool.asset} onClick={() => handleChangePool(_pool.asset as string)} className='flex gap-2'>
                <Image
                  src={ _pool.image as string }
                  width={25}
                  height={20}
                  alt={"sun"}      
                  className='rounded-full' 
                  priority={true}
                />
                <span>{_pool.ticker}</span>
                <span>/</span>
                <Image
                  src="/images/tokens/cacao.png"
                  width={25}
                  height={20}
                  alt={"cacao"}
                  priority={true}      
                />
                <span>CACAO</span>
              </Dropdown.Item>)
            }
          </Dropdown>
          <div className='text-md text-[#22C55E]'>
            { reduceAmount (Number(selectedPool?.assetDepth)/10**8) }
          </div>
          <div className='text-sm'>$ { reduceAmount (Number(selectedPool?.assetDepth)*Number(selectedPool?.assetPriceUSD)/10**8) }</div>
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