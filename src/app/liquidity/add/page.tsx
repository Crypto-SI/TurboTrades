"use client"
import React from 'react';
import Image from "next/image";
import { Icon } from '@iconify/react';

const AddLiquidity = () => {

  return (
    <div className="flex-grow flex justify-center items-center mt-20">
      <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full md:w-[calc(100vw-360px)] lg:w-[600px]">
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
              <div className='w-1/3 flex justify-center items-center p-4 rounded-xl dark:bg-[#111317] border dark:border-[#1B2028] gap-2'>
                Pool<Icon icon="iconamoon:arrow-down-2-duotone" width={24} className='text-white font-bold'/>
              </div>
            </div>
            <div className='w-full lg:w-1/3 flex p-4 justify-center items-center rounded-xl dark:bg-[#111317] border dark:border-[#1B2028] gap-2'>
              <Icon icon="iconamoon:arrow-down-2-duotone" width={24} className='text-white font-bold'/>
              <span className='text-[#2ABA3C]'>ARP</span><span className='text-[#2ABA3C] font-bold'>60%</span>
            </div>
          </div>
          <div className="flex mt-3 gap-2 flex-col lg:flex-row">
            <div className="w-full p-4 dark:text-[#ffffffa1] dark:bg-[#030506] bg-[#F3F7FC] rounded-2xl">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddLiquidity;