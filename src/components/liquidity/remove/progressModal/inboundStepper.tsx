/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import ClipboardCopier from '@/components/share/copyToClipboard';
import { _feeEstimation, _reduceHash, reduceAddress, sleep } from '@/utils/methods';
import useNotification from '@/hooks/useNotification';
import axios from 'axios';
import { TOKEN_DATA, CHAIN_DATA } from '@/utils/data';
import { STATUS, LIQUIDITY } from '@/utils/constants';
import { IPool } from '@/types/maya';
import { CHAINS, reduceAmount } from '@/utils/methods';
import { _renderLocaleDateTimeString, inboundConfirmTimeEstimation, _renderEstimationTime } from '@/utils/methods';
import { TxResult } from '@/types';
interface IParamsStepItem {
  setStepper: React.Dispatch<React.SetStateAction<string>>,
  stepper: string,
  token: IPool,
  hash: string,
  mode: string
}

const StepperItem = ({ token, hash, setStepper, mode }: IParamsStepItem) => {
  const [status, setStatus] = React.useState<string>(STATUS.PENDING);
  const [counter, setCounter] = React.useState<number>(0); 
  const [timeEstimation, setTimeEstimation] = React.useState<number>(0);
  const [txResult, setTxResult] = React.useState<TxResult|undefined>(undefined);
  //timer ref
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  //notifaction
  const { showNotification } = useNotification ();

  React.useEffect(() => {
    if (txResult?.confirmed) {
      setStatus(STATUS.SUCCESS);
    }
  }, [txResult])
  //fetch transaction data from explorer
  const fetchProgress = async(_hash: string) => {
    try {
      const _txResult: TxResult = await CHAINS[mode === LIQUIDITY.ASYM ? token.chain : 'MAYA'].getTransaction(_hash)
      setTxResult(_txResult);
    } catch (err){
      console.log("@Ex get transaction from MAYA ---->", err);
    }
  }
  //when hash is changed, txHash: "" -> "0x0000..."
  React.useEffect(() => {
    if (hash === STATUS.FAILED) {
      setStatus (STATUS.FAILED);
      setStepper (STATUS.FAILED);
    } else if (hash) { //if has is available...
      const _timeEstimation = inboundConfirmTimeEstimation(mode === LIQUIDITY.ASYM ? token.chain : 'MAYA');
      setTimeEstimation(_timeEstimation);
      setCounter(_timeEstimation);
      setStatus(STATUS.PENDING);
    }
  }, [hash]);
  //when estimatin is under 0
  React.useEffect(() => {
    if (counter <= 0) {
      // setCounter (timeEstimation);
      // clearInterval(timerRef.current as NodeJS.Timeout);
    }
  }, [counter]);
  //when status is changed to PENDIND, and hash is available...
  React.useEffect(() => {
    if (status === STATUS.PENDING && hash) {
      let _cnt = 1;
      timerRef.current = setInterval(async() => {
        setCounter(counter => counter - 1);
        if ( _cnt % 5 === 0 ) {
          await fetchProgress(hash);
        }
        _cnt ++;
      }, 1000);
    } else if (status === STATUS.SUCCESS) {
      showNotification('Inbound transaction Success', STATUS.SUCCESS);
      setStepper("maya");
    }
    return () => {
      clearInterval(timerRef.current as NodeJS.Timeout);
    }
  }, [status, hash]);
  /**
   * render time according to the counter
   * 00:10:23
   */
  const _renderCounter = React.useMemo(() => {

    if (counter <= 0) {
      return '00:00:00'
    }

    let _hour : number | string = Math.floor(counter / 3600);
    let _minute : number | string = Math.floor((counter % 3600) / 60);
    let _second : number | string = (counter % 3600) % 60;

    _hour = _hour < 10 ? '0' + _hour : _hour;
    _minute = _minute < 10 ? '0' + _minute : _minute;
    _second = _second < 10 ? '0' + _second : _second;
    return `${_hour}:${_minute}:${_second}`
  }, [counter]);

  return (
    <div className='w-full text-left flex text-gray-500 dark:text-gray-400'>
      <div className='w-1/2 flex flex-col items-end px-7'>
        { status === STATUS.READY && 'Queued' }
        { status === STATUS.PENDING && 
          <>
            <span className='dark:text-gray-200'>{_renderCounter}</span>
            {
              hash && 
              <div className='text-[12px] flex gap-1 items-center'>
                <span className='cursor-pointer hover:underline' onClick={() => window.open(CHAIN_DATA[mode === LIQUIDITY.ASYM ? token.chain : 'MAYA'].explorer + '/tx/' + hash, "_blank")}>{reduceAddress(hash, 8)}</span>
                <ClipboardCopier text={hash} size={18}/>
              </div>
            }
          </>  
        }
        { status === STATUS.SUCCESS && 
          <>
            <span className='dark:text-gray-200'>{_renderLocaleDateTimeString(txResult?.blocktime)}</span>
            { 
              hash && 
              <div className='text-[12px] flex gap-1 items-center'>
                <span className='cursor-pointer hover:underline' onClick={() => window.open(CHAIN_DATA[mode === LIQUIDITY.ASYM ? token.chain : 'MAYA'].explorer + '/tx/' + hash, "_blank")}>{reduceAddress(hash, 8)}</span>
                <ClipboardCopier text={hash} size={18}/>
              </div>
            }
          </> 
        }
      </div>
      <div className={`relative w-1/2 flex flex-col items-start px-7 dark:border-gray-400 min-h-[150px] border-l ${ status === 'success' && '!border-blue-200' }`}>
        <span className='dark:text-gray-200'>
          { status === STATUS.READY &&  ( mode === LIQUIDITY.ASYM ? `Send ${token.ticker} to Inbound vault.` : `Send CACAO to withdraw.` ) }
          { status === STATUS.PENDING &&  ( mode === LIQUIDITY.ASYM ? `Sending ${token.ticker} to Inbound vault.` : `Send CACAO to MAYA.`) }  
          { status === STATUS.SUCCESS &&  ( mode === LIQUIDITY.ASYM ? `Sent ${token.ticker} to Inbound vault Successfully.` : `CACAO Sent Succesfully.`) }
          { status === STATUS.FAILED &&  ( mode === LIQUIDITY.ASYM ? `${token.chain} Transaction Failed.` : `MAYA Transaction Failed.`) }
        </span>
        <span className='text-[12px]'>
          { status === STATUS.READY &&  ( mode === LIQUIDITY.ASYM ? `Ready ${token.ticker} to Inbound Vault.` : `Ready to send CACAO.`) }
          { status === STATUS.PENDING &&  `${ mode === LIQUIDITY.ASYM ? `${token.ticker} will reach Inbound Vault`: 'CACAO will reach MAYA' } within approximately${timeEstimation ? ` ${_renderEstimationTime(timeEstimation)}mins (waiting for confirmation)` : '...'}` }  
          { status === STATUS.SUCCESS &&  
            <>
              <div className='pb-1'>{ mode === LIQUIDITY.ASYM ? `${token.ticker} reached MAYA Inbound vault by` : 'CACAO reached MAYA by' }</div>
              { txResult && <div>block: {txResult.blockHeight}</div> }
              { txResult?.confirmations && <div>confimrations: {txResult.confirmations}</div> }
              { txResult?.fee && <div>fee: {txResult.fee}{ mode === LIQUIDITY.ASYM ? token.ticker : 'CACAO' }</div> }
            </>
          }
          { status === STATUS.FAILED &&  `Failed Transaction` }
        </span>
        <div className='text-3xl absolute left-0 top-0 p-1 rounded-full -translate-x-1/2 -translate-y-2 bg-white dark:bg-[#0A0C0F]'>
          { status === STATUS.READY && <Icon icon="f7:tag-circle" /> }
          { status === STATUS.PENDING && <div className='spin'><Icon icon="mingcute:loading-fill"/></div> }
          { status === STATUS.SUCCESS && <Icon icon="tabler:check" className='text-blue-200'/> }
          { status === STATUS.FAILED && <Icon icon="openmoji:warning" className='text-blue-200'/> }
        </div>
      </div>
    </div>
  )
}

export default StepperItem;