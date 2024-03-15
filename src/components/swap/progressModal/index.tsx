import React from 'react';
import { Icon } from '@iconify/react';
import { Button, Timeline } from 'flowbite-react';
import Image from "next/image";
// import { HiArrowNarrowRight, HiCalendar } from 'react-icons/hi';
import StepperItem from './stepperItem';
import { IPool } from '@/types/maya';
import { reduceAmount } from '@/utils/methods';

interface IProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  fromToken: IPool,
  toToken: IPool,
  fromAmount: string,
  toAmount: string,
  hash: string,
}

const ProgressModal = (props: IProps) => {
  const [step, setStep] = React.useState<number>(1);
  const handleNext = () => {  
    setStep(step + 1);
  }
  const handlePrevious = () => {  
    setStep(step - 1);
  }

  return (
    <div>
      <div onClick={() => props.setVisible(false)} className="fixed top-0 left-0 right-0 bottom-0 bg-[#0000003d] z-10 backdrop-filter backdrop-blur-[10px]"></div>
      <div className="rounded-2xl z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full lg:w-[600px]">
        <div className="rounded-2xl text-center p-4 bg-white dark:bg-[#0A0C0F] dark:text-white text-black pb-10">
          <div className='flex items-center flex-col gap-1 my-3 mb-5'>
            <Icon icon="icomoon-free:spinner9" className='text-2xl spin' />
            <div className='text-center'>Swap Transfer in Progress</div>
          </div>

          <div className="flex p-3 mb-4 text-sm text-gray-800 border-l-2 border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-gray-300">
            <div className=''>
              <svg className="flex-shrink-0 inline w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
            </div>
            <div className='text-justify'>
              Swap transfers seem to be taking longer than expected. Do not worry. Transfer times may vary depending on network conditions and MAYA Chain activity.
              If more than 3 hours have passed, please contact TurboTrades Support.
            </div>
          </div>


          <div className='flex w-full gap-2 items-center rounded-lg justify-center dark:bg-[#111b20fd] p-3 mt-2 mb-7'>
            <div className='flex gap-2 items-center'>
              <Image
                src={props.fromToken.image || "/images/tokens/btc.webp"}
                width={30}
                height={30}
                alt={"sun"}
                className='rounded-full'
                priority={true}
              />
              <div className='flex flex-col items-center text-sm'>
                <span>-{props.fromAmount}</span>
                <span className='text-[11px]'>${reduceAmount(Number(props.fromAmount) * Number(props.fromToken?.assetPriceUSD))}</span>
              </div>
            </div>
            <Icon icon="tdesign:swap" />
            <div className='flex gap-2 items-center'>
              <Image
                src={props.toToken.image || "/images/tokens/btc.webp"}
                width={30}
                height={30}
                alt={"sun"}
                className='rounded-full'
                priority={true}
              />
              <div className='flex flex-col items-center text-sm'>
                <span>+{props.toAmount}</span>
                <span className='text-[11px]'>${reduceAmount(Number(props.toAmount) * Number(props.toToken?.assetPriceUSD))}</span>
              </div>
            </div>
          </div>

          <StepperItem 
            status={ step === 1 ? 'ready' : step === 2 ? 'pending' : 'success' }
            title={{
              pending: "Sending from BTC",
              ready: "Send from BTC",
              success: "Sent from BTC successfully"
            }}
            details={{
              ready: "Send BTC to MAYA vault for swap",
              pending: "Sending BTC to MAYA vault, it will take a while",
              success: "Sent BTC to MAYA vault successfully"
            }}
            hash={props.hash}
          />
          <StepperItem 
            status={ step === 1 ? 'ready' : step === 2 ? 'pending' : 'success' }
            title={{
              pending: "Sending from BTC",
              ready: "Send from BTC",
              success: "Sent from BTC successfully"
            }}
            details={{
              ready: "Send BTC to MAYA vault for swap",
              pending: "Sending BTC to MAYA vault, it will take a while",
              success: "Sent BTC to MAYA vault successfully"
            }}
            divider={false}
            hash={props.hash}
          />

          <button onClick={handlePrevious}>prev</button>
          <button onClick={handleNext}>Next</button>

        </div>
      </div>
    </div>
  )
}

export default ProgressModal;