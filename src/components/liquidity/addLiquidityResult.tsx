import React from 'react';
import { Icon } from '@iconify/react';
import Image from "next/image";
import { IPool } from '@/types/maya';
import { useAtom } from 'jotai';
import { fromTokenAtom, tokenPricesAtom } from '@/store';
import { reduceAmount } from '@/utils/methods';

interface IProps {
  onOK: () => void,
  pool: IPool,
  mode: string,
  amount: string
}

// const Confirm = ({ onOK, onCancel, pool, mode, amount }: IProps) => {
const Confirm = ({ onOK, pool, mode, amount }: IProps) => {

  const [tokenPrices, ] = useAtom(tokenPricesAtom);
  return (
    <div>
      <div onClick={onOK} className="fixed top-0 left-0 right-0 bottom-0 bg-[#0000003d] z-10 backdrop-filter backdrop-blur-[10px]"></div>
      <div className="fixed w-full px-3 sm:w-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative dark:text-white px-10 py-6 text-center dark:bg-[#232E42] bg-white w-full rounded-2xl">
          <div className='text-left w-full'>
          <div className='flex gap-2 items-center py-2 mt-2'>
            <div className='flex gap-1 items-center'>
              <Image
                src={pool ? String(pool.image) : "/images/tokens/cacao.png"}
                width={35}
                height={35}
                alt={"sun"}      
                className='rounded-full'
              />
              <span>{ pool?.ticker }</span>
            </div>
            /
            <div className='flex gap-1 items-center'>
              <Image
                src={"/images/tokens/cacao.png"}
                width={35}
                height={35}
                alt={"sun"}      
                className='rounded-full'
              />
              <span>CACAO</span>
            </div>
          </div>
          </div>
          <div className='text-sm mr-2 mb-3 text-left'>( Please make sure you have sufficient swap fee )</div>
          {/* { 
            mode === "sym" && Number(amount) > 0 &&
            <div className='px-1 text-left flex justify-between mb-1 text-sm'>
              <span>CACAO Fee</span>
              <div className='text-right'>(${ reduceAmount(0.5*Number(tokenPrices["MAYA.CACAO"])) }) 0.50 CACAO</div>
            </div>
          } */}
          <div className='px-1 text-left flex justify-between my-1 text-sm'>
            <span>Affiliate Fee (.75%)</span>
            {/* { 
              Number(amount) > 0 && mode === "sym" && pool ? 
              <div className='text-right'>(${ reduceAmount(Number(amount)*0.0075*2*Number(pool.assetPrice)*Number(tokenPrices["MAYA.CACAO"])) }) { reduceAmount(Number(amount)*0.0075*2*Number(pool.assetPrice)) } CACAO</div> :  
              <div className='text-right'>(${ reduceAmount(Number(amount)*0.0075*Number(tokenPrices[String(pool.asset)])) }) { reduceAmount(Number(amount)*0.0075) } { pool?.ticker }</div>
            } */}
          </div>
          <div className='text-left w-full mt-6 flex justify-between gap-1 flex-col xs:gap-3 xs:flex-row'>
            <button
              onClick={onOK}
              className="flex gap-1 justify-center items-center bg-[#3C829B] m-auto mt-1 text-white dark:text-[#6A84A0] hover:opacity-50 hover:dark:text-white dark:text-[#ffffff86]  text-sm rounded-2xl w-full px-4 py-2 cursor-pointer" 
            >
              <Icon icon="iconoir:coins-swap" width={20} className='text-[#70dd5a]' /> Add Liquidity
            </button>
            <button
              onClick={onOK}
              className="flex gap-1 justify-center items-center border dark:border-[#54575a] m-auto mt-1 text-[#6A84A0] hover:text-black hover:dark:text-white  text-sm rounded-2xl w-full px-4 py-2 bg-transparent cursor-pointer" 
            >
              <Icon icon="mage:cancel" width={20} /> Cancel
            </button>
          </div>
        </div>
        <div className='absolute -top-8 text-white flex w-full justify-between items-center px-2 pr-8'>
          <div className='flex items-center gap-2 cursor-pointer hover:opacity-50'>
          <Icon icon="flat-color-icons:info" width="1.7rem" height="1.7rem"  className='text-[#70dd5a]'></Icon> <span className='text-lg font-bold'>Transaction sent successfully</span>
            {/* <Icon icon="mage:message-question-mark-round-fill" width="1.7rem" height="1.7rem"  className='text-[#70dd5a]'></Icon> <span className='text-lg font-bold'>Add Liquidity ({ mode === "sym" ? "symmetric": "asymmetric" })</span> */}
          </div>
          <div><Icon onClick={onOK} icon="ic:sharp-close" className='cursor-pointer hover:opacity-50' width={30}/></div>
        </div>
      </div>
    </div>
  )
}

export default Confirm;