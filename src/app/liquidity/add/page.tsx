"use client"
import React from 'react';
import Image from "next/image";
import { Icon } from '@iconify/react';
import { Dropdown } from 'flowbite-react';

const AddLiquidity = () => {

  const _renderPoolSelector = () => (
    <div className='w-1/3 flex justify-center items-center p-4 rounded-xl dark:bg-[#111317] border dark:border-[#1B2028] gap-2 cursor-pointer hover:opacity-50'>
      Pool<Icon icon="iconamoon:arrow-down-2-duotone" width={24} className='text-white font-bold'/>
    </div>
  )

  return (
    <div className="flex grow justify-center items-center mt-20 flex-col">
      <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full lg:w-[600px]">
        <div className="rounded-2xl p-3 pt-4 bg-white dark:bg-[#0A0C0F] dark:text-white">
          
          <div className='flex lg:gap-0 gap-2 lg:space-x-2 lg:flex-row flex-col'>
            <div className='flex space-x-2 lg:w-2/3'>
              <div className='w-2/3 justify-center items-center flex p-4 rounded-xl dark:bg-[#111317] border dark:border-[#1B2028] gap-2'>
                <Image
                  src="/images/chains/dash.png"
                  width={25}
                  height={20}
                  alt={"sun"}      
                  priority={true}
                />
                <span className='xxs:flex hidden'>BTC</span>
                <span>/</span>
                <Image
                  src="/images/chains/thor.webp"
                  width={25}
                  height={20}
                  alt={"sun"}      
                  priority={true}
                />
                <span className='xxs:flex hidden'>ETH</span>
              </div>
              <Dropdown label=""  renderTrigger={_renderPoolSelector}>
                <Dropdown.Item>Liquidity Pools</Dropdown.Item>
                <Dropdown.Divider />
                {
                  ["USDT/USDC", "BTC/USDT"].map((item: any) => 
                  <Dropdown.Item key={item} className='flex gap-2'>
                    <Image
                      src="/images/chains/dash.png"
                      width={25}
                      height={20}
                      alt={"sun"}      
                      priority={true}
                    />
                    <span className='xxs:flex hidden'>BTC</span>
                    <span>/</span>
                    <Image
                      src="/images/chains/thor.webp"
                      width={25}
                      height={20}
                      alt={"sun"}      
                      priority={true}
                    />
                    <span className='xxs:flex hidden'>ETH</span>
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
              <span className='text-[#2ABA3C]'>ARP</span><span className='text-[#2ABA3C] font-bold'>60%</span>
            </div>
          </div>


          <div className="w-full p-4 dark:text-[#ffffffa1] dark:bg-[#030506] bg-[#F3F7FC] rounded-2xl mt-3">
            <div className='flex justify-between items-center'>
              <div className='flex gap-3 text-xl items-center'>
                <Image
                  src="/images/chains/btc.webp"
                  width={50}
                  height={50}
                  alt={"sun"}      
                  priority={true}
                />
                BTC
              </div>
              <div className='flex gap-2 items-center'>
                <span className='text-[#2ABA3C] text-lg'>APR</span>
                <span className='text-[#2ABA3C] text-lg'>:</span>
                <span className='text-2xl font-bold text-[#2ABA3C]'>60%</span>
              </div>
            </div>

            <div className='flex flex-col xs:flex-row gap-2 mt-3 justify-between'>
              <div className='flex flex-col xs:flex-row items-center justify-between dark:bg-[#0a0f14] grow bg-white border border-[#DCE4EF] dark:border-[#3341558e] rounded-xl p-[6px]'>
                <div className='w-full xs:w-auto text-[#8A8D92] dark:text-[#B0B7C3] pl-3'>Amount:</div>
                <input
                  placeholder="0.0"
                  className="grow px-2 bg-transparent py-2 rounded-[12px] w-full outline-none border-none" 
                />
                <div className='px-2 w-full xs:w-auto'>12$</div>
                <div className='w-full xs:w-auto dark:bg-[#0a0f14] bg-[#E2E6EB] border border-[#DCE4EF] dark:border-[#3341558e] cursor-pointer hover:opacity-50 rounded-xl p-3'>MAX</div>
              </div>
              <button className='text-white rounded-xl bg-gradient-to-r from-[#FF6802] to-[#EE0E72] p-3 w-full xs:w-[100px] cursor-pointer hover:opacity-50'>ADD</button>
            </div>

            <div className='flex items-center justify-center hover:opacity-50 cursor-pointer mt-10 bg-[#131822] text-[#B0B7C3] dark:text-[#B0B7C3] gap-2 p-3 rounded-xl w-full dark:bg-[#0F161F]'>
              Add two sided
              <Icon icon="iconamoon:arrow-down-2-duotone" width={24} className='text-white font-bold'/>
            </div>

          </div>
 

          

        </div>
      </div>

      <div className="relative my-6 border-dashed border-b border-[#00000059] dark:border-[#ffffff4f] w-full lg:w-[600px]">
        <div className="absolute flex items-center justify-center w-12 h-12 border-8 border-[#F3F7FC] dark:border-[#030506] rounded-full left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#8f7676] dark:bg-[#131822]">
          <Icon icon="tdesign:swap" className="text-white hover:opacity-50 cursor-pointer arrow-rotate" rotate={1}/>
        </div>
      </div>

      <div className="rounded-2xl p-3 pt-4 bg-white dark:bg-[#0A0C0F] dark:text-white  mt-10 md:mt-0 w-full lg:w-[600px] border border-dashed dark:border-[#F2215A]">
   


        <div className="w-full p-4 dark:text-[#ffffffa1] dark:bg-[#0F161F] bg-[#F3F7FC] rounded-2xl mt-3 border dark:border-[#33415583]">
          <div className='flex items-center gap-2'>
            <Image
              src="/images/chains/btc.webp"
              width={50}
              height={50}
              alt={"sun"}      
              priority={true}
            />
            BTC
          </div>

          <div className='flex flex-col xs:flex-row gap-1 mt-4 items-center justify-between dark:bg-[#0a0f14] grow bg-white border border-[#DCE4EF] dark:border-[#3341558e] rounded-xl p-[6px]'>
            <div className='w-full xs:w-auto text-[#8A8D92] dark:text-[#B0B7C3] pl-3'>Amount:</div>
            <input
              placeholder="0.0"
              className="grow px-2 bg-transparent py-2 rounded-[12px] w-full outline-none border-none" 
            />
            <div className='px-2 w-full xs:w-auto'>12$</div>
          </div>

          <button className='text-white mt-4 rounded-xl bg-gradient-to-r from-[#FF6802] to-[#EE0E72] p-3 w-full cursor-pointer hover:opacity-50'>Add Liquidity</button>

          
        </div>
      </div>

    </div>
  )
}

export default AddLiquidity;