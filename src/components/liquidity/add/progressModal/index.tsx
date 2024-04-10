/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import Image from "next/image";

import { IPool } from '@/types/maya';
import { reduceAmount } from '@/utils/methods';

import AssetStepper from './assetStepper';
import CacaoStepper from './cacaoStepper';
import OutboundStepper from './mayaStepper';

//data
import { STATUS, LIQUIDITY } from '@/utils/constants';
//types
import { IInboundResults } from '@/types/maya';

interface IProps {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  hashes: Record<string, string>
  setHashes: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  pool: IPool,
  amount: string,
  mode: string,
  address: string,
  mayaAddress: string
}

const ProgressModal = (props: IProps) => {
  const [stepper, setStepper] = React.useState<string>("inbound");
  //tx status
  const [inboundResults, setInboundResults] = React.useState<IInboundResults>({ 'ASSET': STATUS.READY, 'CACAO': STATUS.READY });

  React.useEffect(() => {
    if (props.mode === LIQUIDITY.ASYM && inboundResults.ASSET === STATUS.SUCCESS) {
      setStepper ('maya');
    } else if (props.mode === LIQUIDITY.SYM && inboundResults.ASSET === STATUS.SUCCESS && inboundResults.CACAO === STATUS.SUCCESS) {
      setStepper ('maya');
    } else if (inboundResults.ASSET === STATUS.FAILED || inboundResults.CACAO === STATUS.FAILED) {
      setStepper (STATUS.FAILED);
    }
  }, [inboundResults]);

  React.useEffect(() => {
    return () => {
      props.setHashes({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-[#0000003d] z-10 backdrop-filter backdrop-blur-[10px]"></div>
      <div className="rounded-2xl z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full lg:w-[600px]">
        <div className="rounded-2xl relative text-center p-4 bg-white dark:bg-[#0A0C0F] dark:text-white text-black pb-10">
          <div className='flex items-center justify-center flex-col gap-1 my-3 mb-5'>
            { (stepper !== STATUS.SUCCESS && stepper !== STATUS.FAILED) ? 
              <div className='w-[40px] h-[40px] flex items-center justify-center'><Icon icon="icomoon-free:spinner9" className='text-2xl spin'/></div> :
              <Image
                src="/favicon.svg"
                width={45}
                height={45} 
                alt={"logo"}  
                priority={true}
                className='translate-x-1'     
              /> 
            }
            <div className='text-center'>
              { stepper !== STATUS.SUCCESS && stepper !== STATUS.FAILED && "Adding liquidity in progress" }
              { stepper === STATUS.SUCCESS && "Added Liquidity Success" }
              { stepper === STATUS.FAILED && "Add Liquidity Failed" }
            </div>
          </div>

          <div className="flex p-3 mb-4 text-sm text-gray-800 border-l-2 border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-gray-300">
            <div className=''>
              <svg className="flex-shrink-0 inline w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
              </svg>
            </div>
            <div className='text-justify'>
              Adding Liquidity transactions seem to be taking longer than expected. Do not worry. Transaction times may vary depending on network conditions and MAYA Chain activity.
              If more than an hour have passed, please contact TurboTrades Support.
            </div>
          </div>

          <div className='flex w-full gap-2 items-center rounded-lg justify-center dark:bg-[#111b20fd] p-3 mt-2 mb-7'>
            <div className='flex gap-2 items-center'>
              <Image
                src={props.pool.image || "/images/tokens/btc.webp"}
                width={30}
                height={30}
                alt={"sun"}
                className='rounded-full'
                priority={true}
              />
              <div className='flex flex-col items-center text-sm'>
                <span>+{reduceAmount(props.amount)}</span>
                <span className='text-[11px]'>${reduceAmount(Number(props.amount) * Number(props.pool?.assetPriceUSD))}</span>
              </div>
            </div>
            {
              props.mode === LIQUIDITY.SYM &&
              <>
                <Icon icon="flat-color-icons:currency-exchange" width={25}/>
                <div className='flex gap-2 items-center'>
                  <Image
                    src={"/images/tokens/cacao.png"}
                    width={30}
                    height={30}
                    alt={"sun"}
                    className='rounded-2xl'
                    priority={true}
                  />
                  <div className='flex flex-col items-center text-sm'>
                    <span>+{reduceAmount(Number(props.amount)*Number(props.pool.assetPrice))}</span>
                    <span className='text-[11px]'>${reduceAmount(Number(props.amount) * Number(props.pool?.assetPriceUSD))}</span>
                  </div>
                </div>
              </>
            }
          </div>
          <AssetStepper 
            token={props.pool}
            hash={props.hashes['ASSET']}
            setInboundResults={setInboundResults}
          />
          {
            props.mode === LIQUIDITY.SYM &&
            <CacaoStepper 
              token={props.pool}
              hash={props.hashes['CACAO']}
              setInboundResults={setInboundResults}
            />
          }
          <OutboundStepper 
            token={props.pool}
            mode={props.mode}
            hash={props.hashes['ASSET']}
            setStepper={setStepper}
            stepper={stepper}
          />
          <div className='absolute top-4 right-4 text-white flex justify-between items-center'>
            <div><Icon onClick={() => props.setVisible(false)} icon="ic:sharp-close" className='cursor-pointer hover:opacity-50' width={30}/></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressModal;