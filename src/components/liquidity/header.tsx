"use client"
import React from 'react';
import { Dropdown } from 'flowbite-react';
import { Icon } from '@iconify/react';
import Image from "next/image";


const Header = () => {
  
  const _renderDropdownCollapse = () => (
    <div className='flex gap-2 grow-0'>
      <div className='text-lg'>
        BTC / USDT
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
          <div className='flex gap-2 items-center text-lg dark:text-[#BCBCBC] text-black'>
            Pool Liquidity
          </div>
          <div className='text-xs text-[#6978A0] dark:text-[#8D98AF]'>+1.25%</div>
        </div>
        <div className='text-md pt-1 dark:text-white text-[#8A8D92] text-wrap'>0.256567545 BTC</div>
        <div className='text-sm dark:text-[#8D98AF] text-[#6978A0]'>3,700.96 USDT</div>
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
          <div className='flex gap-2 items-center text-lg dark:text-[#BCBCBC] text-black'>
            My Liquidity
          </div>
          <div className='text-xs text-[#6978A0] dark:text-[#8D98AF]'>+1.25%</div>
        </div>
        <div className='text-md pt-1 dark:text-white text-[#8A8D92] text-wrap'>0.256567545 BTC</div>
        <div className='text-sm dark:text-[#8D98AF] text-[#6978A0]'>3,700.96 USDT</div>
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
          <div className='flex gap-2 items-center text-lg dark:text-[#BCBCBC] text-black'>
            24h Liquidity
          </div>
          <div className='text-xs text-[#6978A0] dark:text-[#8D98AF]'>+1.25%</div>
        </div>
        <div className='text-md pt-1 dark:text-white text-[#8A8D92] text-wrap'>0.256567545 BTC</div>
        <div className='text-sm dark:text-[#8D98AF] text-[#6978A0]'>3,700.96 USDT</div>
      </div>
    </div>
  )

  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full grow">
      <div className="rounded-2xl px-5 py-6 bg-white dark:bg-[#0B0F16] dark:text-white flex flex-col lg:flex-row gap-3 lg:items-center">
        <div>
          <Dropdown label=""  renderTrigger={_renderDropdownCollapse}>
          <Dropdown.Item>Liquidity Pools</Dropdown.Item>
          <Dropdown.Divider />
          {
            ["USDT/USDC", "BTC/USDT"].map((item: any) => 
            <Dropdown.Item key={item} className='flex gap-2'>
              {/* <Image
                src="/images/tokens/btc.webp"
                width={19}
                height={19}
                alt={"logo"}      
                priority={true}
              /> */}
              {item}
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
      </div>
    </div>
  )
}

export default Header;