import React from 'react';
import { Icon } from '@iconify/react';
import Image from "next/image";
import { IPool } from '@/types/maya';
import { fromTokenAtom } from '@/store';

interface IProps {
  onOK: () => void,
  onCancel: () => void,
  fromToken?: IPool,
  toToken?: IPool,
  amount: string
}

const SwapConfirm = (props: IProps) => {

  return (
    <div>
      <div onClick={props.onCancel} className="fixed top-0 left-0 right-0 bottom-0 bg-[#0000003d] z-10 backdrop-filter backdrop-blur-[10px]"></div>
      <div className="fixed w-full px-3 sm:w-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative dark:text-white px-10 py-6 text-center dark:bg-[#232E42] bg-white w-full rounded-2xl">
          <div className='text-left w-full'>
          <div className='flex gap-3 items-center py-2 mt-2'>
            <div className='flex gap-1 items-center'>
              <Image
                src={props.fromToken ? String(props.fromToken.image) : "/images/tokens/cacao.png"}
                width={35}
                height={35}
                alt={"sun"}      
                className='rounded-full'
              />
              { props.fromToken?.ticker }
            </div>
            <Icon icon="tdesign:swap" />
            <div className='flex gap-1 items-center'>
              <Image
                src={props.toToken ? String(props.toToken.image) : "/images/tokens/cacao.png"}
                width={35}
                height={35}
                alt={"sun"}      
                className='rounded-full'
              />
              { props.toToken?.ticker }
            </div>
          </div>
          </div>
          <div className='text-left w-full mt-2 text-sm flex gap-1 items-center'>
            <Icon icon="mdi:map-marker-question-outline" width={25}/> Do you agree to swap {props.amount} {props.fromToken?.ticker} to {props.toToken?.ticker} ?
          </div>
          <div className='text-sm mt-2 text-left'>( Please make sure you have sufficient swap fee )</div>
          <div className='text-left w-full mt-6 flex justify-between gap-1 flex-col xs:gap-3 xs:flex-row'>
            <button
              onClick={props.onOK}
              className="flex gap-1 justify-center items-center bg-[#3C829B] m-auto mt-1 text-white dark:text-[#6A84A0] hover:opacity-50 hover:dark:text-white dark:text-[#ffffff86]  text-sm rounded-2xl w-full px-4 py-2 cursor-pointer" 
            >
              <Icon icon="iconoir:coins-swap" width={20} className='text-[#70dd5a]' /> Swap
            </button>
            <button
              onClick={props.onCancel}
              className="flex gap-1 justify-center items-center border dark:border-[#54575a] m-auto mt-1 text-[#6A84A0] hover:text-black hover:dark:text-white  text-sm rounded-2xl w-full px-4 py-2 bg-transparent cursor-pointer" 
            >
              <Icon icon="mage:cancel" width={20} /> Cancel
            </button>
          </div>
        </div>
        <div className='absolute -top-8 text-white flex w-full justify-between items-center px-2 pr-8'>
          <div className='flex items-center gap-2 cursor-pointer hover:opacity-50'>
            <Icon icon="mage:message-question-mark-round-fill" width="1.7rem" height="1.7rem"  className='text-[#70dd5a]'></Icon> <span className='text-lg font-bold'>Swap Confirm</span>
          </div>
          <div><Icon onClick={props.onCancel} icon="ic:sharp-close" className='cursor-pointer hover:opacity-50' width={30}/></div>
        </div>
      </div>
    </div>
  )
}

export default SwapConfirm;