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

  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full grow">
      <div className="rounded-2xl px-5 py-6 bg-white dark:bg-[#0B0F16] dark:text-white flex">
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
        {/* <div className='flex grow'>
          <div className='w-full bg-black'>asdf</div>
        </div> */}
      </div>
    </div>
  )
}

export default Header;