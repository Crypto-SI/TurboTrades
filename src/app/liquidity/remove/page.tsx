"use client"
import React from 'react';
import Image from "next/image";
import { Icon } from '@iconify/react';
import { Dropdown } from 'flowbite-react';

const AddLiquidity = () => {
  //set mode between single and double
  const [mode, setMode] = React.useState<string>("single");

  const _renderPoolSelector = () => (
    <div className='w-1/3 flex justify-center items-center p-4 rounded-xl dark:bg-[#111317] border dark:border-[#1B2028] gap-2 cursor-pointer hover:opacity-50'>
      Pool<Icon icon="iconamoon:arrow-down-2-duotone" width={24} className='text-white font-bold'/>
    </div>
  )

  return (
    <div className="flex grow justify-center items-center mt-20 flex-col">
      <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full lg:w-[750px]">
        <div className="rounded-2xl p-3 pt-4 bg-white dark:bg-[#0A0C0F] dark:text-white">
          <div className='flex lg:gap-0 text-md gap-2 lg:space-x-2 lg:flex-row flex-col dark:bg-black bg-[#F7FAFD] dark:border-none border-[#DCE4EF] border p-2 rounded-2xl'>
            <button onClick={() => setMode("single")} className={`bg-[#0A0F14] p-3 w-full lg:w-1/2 hover:opacity-80 rounded-xl text-white ${mode === "single" && 'bg-gradient-to-r from-[#FF6802] to-[#EE0E72]'}`}>SINGLE SIDE</button>
            <button onClick={() => setMode("double")} className={`bg-[#0A0F14] p-3 w-full lg:w-1/2 hover:opacity-80 rounded-xl text-white ${mode === "double" && 'bg-gradient-to-r from-[#FF6802] to-[#EE0E72]'}`}>DOUBLE SIDE</button>
          </div>


          <div className={`flex space-x-2 flex-col lg:flex-row`}>
            <div className="w-full p-4 dark:text-[#ffffffa1] dark:bg-[#030506] bg-[#F3F7FC] rounded-2xl mt-3 border border-[#DCE4EF] dark:border-none">
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
                <button className='rounded-xl dark:bg-[#0A0F14] aspect-auto p-3 bg-white dark:border-[#D1DBE8] border border-none text-[#A6ADB9] hover:opacity-80'>50%</button>
              </div>
              <div className='flex flex-col xs:flex-row gap-2 mt-3 justify-between'>
                <div className='flex flex-col xs:flex-row items-center justify-between dark:bg-[#0a0f14] grow bg-white border border-[#DCE4EF] dark:border-[#3341558e] rounded-xl p-[6px]'>
                  <div className='w-full xs:w-auto text-[#8A8D92] dark:text-[#B0B7C3] pl-3'>Amount:</div>
                  <input
                    placeholder="0.0"
                    className="grow px-2 bg-transparent py-2 rounded-[12px] w-full outline-none border-none" 
                  />
                  <div className='px-2 w-full xs:w-auto'>12$</div>
                </div>
                <button className='rounded-xl dark:bg-[#0A0F14] aspect-auto p-3 bg-white dark:border-[#D1DBE8] border border-none text-[#A6ADB9] hover:opacity-80'>MAX</button>
              </div>
              <div className='text-sm text-[#6978A0] mt-2 px-1'>$2036.563</div>
            </div>

            {
              mode === "double" &&
              <div className="w-full p-4 dark:text-[#ffffffa1] dark:bg-[#030506] bg-[#F3F7FC] rounded-2xl mt-3 border border-[#DCE4EF] dark:border-none">
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
                  <button className='rounded-xl dark:bg-[#0A0F14] aspect-auto p-3 bg-white dark:border-[#D1DBE8] border border-none text-[#A6ADB9] hover:opacity-80'>50%</button>
                </div>

                <div className='flex flex-col xs:flex-row gap-2 mt-3 justify-between'>
                  <div className='flex flex-col xs:flex-row items-center justify-between dark:bg-[#0a0f14] grow bg-white border border-[#DCE4EF] dark:border-[#3341558e] rounded-xl p-[6px]'>
                    <div className='w-full xs:w-auto text-[#8A8D92] dark:text-[#B0B7C3] pl-3'>Amount:</div>
                    <input
                      placeholder="0.0"
                      className="grow px-2 bg-transparent py-2 rounded-[12px] w-full outline-none border-none" 
                    />
                    <div className='px-2 w-full xs:w-auto'>12$</div>
                  </div>
                  <button className='rounded-xl dark:bg-[#0A0F14] aspect-auto p-3 bg-white dark:border-[#D1DBE8] border border-none text-[#A6ADB9] hover:opacity-80'>MAX</button>
                </div>
                <div className='text-sm text-[#6978A0] mt-2 px-1'>$2036.563</div>
              </div>
            }
          </div>

          <div className='mt-2 text-[#6978A0] px-1'>
            <span className='font-bold'>Amount: </span>
            <span>1.00 BTC (42.12272850 ETH)</span>
          </div>

          <button className='text-white mt-4 rounded-xl bg-gradient-to-r from-[#FF6802] to-[#EE0E72] p-3 w-full cursor-pointer hover:opacity-50'>Remove Liquidity</button>

        </div>
      </div>

    </div>
  )
}

export default AddLiquidity;