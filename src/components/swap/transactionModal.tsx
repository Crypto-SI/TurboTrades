import React from 'react';
import { Icon } from '@iconify/react';
import { useAtom } from 'jotai';
//atoms
import {
  showTrxModalAtom,
  trxUrlAtom
} from "@/store";
// @ts-ignore

const TransactionModal = () => {
  //atoms
  const [showTrxModal, setShowTrxModal] = useAtom(showTrxModalAtom);//show trx modal
  const [trxUrl, setTrxUrl] = useAtom(trxUrlAtom);

  const handleClose = () => {
    setShowTrxModal(false);
  }

  const _reduceHash = (hash: string) => {
    return hash.substr(0, 10) + "......" + hash.substring(hash.length-12, hash.length-1)
  }

  const _gotoHash = (url: string) => {
    if (window) {
      window.open(url, "_blank");
    }
  }

  return (
    <div className={`${ !showTrxModal && 'hidden' }`}>
      <div onClick={handleClose} className="fixed top-0 left-0 right-0 bottom-0 bg-[#0000003d] z-10 backdrop-filter backdrop-blur-[10px]"></div>
      <div className="fixed w-full px-3 sm:w-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative dark:text-white px-10 py-6 text-center dark:bg-[#232E42] bg-white w-full rounded-2xl">
          <div className='text-left w-full'>
            <div className='px-2 py-2 flex gap-2 items-center'>
              <Icon icon="uil:comment-info" width={30}/> Transaction Sent Successfully.
              {/* <Tooltip placement="right" title="Password for recovery"><span className='cursor-pointer text-[8px] px-2'> ?</span></Tooltip> */}
            </div>
            <div className='px-2 text-cyan-400 text-sm'>
              <a href={trxUrl} target='_blank' className='underline'>{_reduceHash(trxUrl)}</a>
            </div>
            <div className='px-2 pt-2'>
              Will take for a while...
              {/* <Tooltip placement="right" title="Password for recovery"><span className='cursor-pointer text-[8px] px-2'> ?</span></Tooltip> */}
            </div>
 
          </div>

          <div className='text-left w-full mt-6 flex justify-between gap-1 flex-col xs:gap-3 xs:flex-row'>
            <button
              className="flex gap-1 justify-center items-center border dark:border-[#54575a] m-auto mt-1 text-[#6A84A0] hover:text-black hover:dark:text-white  text-sm rounded-2xl w-full px-4 py-2 bg-transparent cursor-pointer" 
              onClick={() => _gotoHash(trxUrl)}
            >
              Go to transaction <Icon icon="noto-v1:link" width={20}/>
            </button>
          </div>
        </div>
        <div className='absolute -top-8 text-white flex w-full justify-between items-center px-2 pr-8'>
          <div className='flex items-center gap-2 cursor-pointer hover:opacity-50'>
            {/* <Icon icon="icon-park-solid:back" width={20}/> <span className='text-lg font-bold'>Connect Wallets</span> */}
            <Icon icon="bitcoin-icons:transactions-filled" width={30}/> <span className='text-lg font-bold'>Transaction Sent</span>
          </div>
          <div onClick={handleClose}><Icon icon="ic:sharp-close" className='cursor-pointer hover:opacity-50' width={30}/></div>
        </div>
      </div>
    </div>
  )
}

export default TransactionModal;