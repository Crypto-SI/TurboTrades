/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Icon } from '@iconify/react';
import ClipboardCopier from '@/components/share/copyToClipboard';
import { _feeEstimation, _reduceHash, reduceAddress, reduceAmount, sleep, CHAINS } from '@/utils/methods';
import useNotification from '@/hooks/useNotification';
import axios from 'axios';
import { TOKEN_DATA, CHAIN_DATA } from '@/utils/data';
import { STATUS, LIQUIDITY } from '@/utils/constants';
import { IPool } from '@/types/maya';
import { _renderLocaleDateTimeString, inboundConfirmTimeEstimation, outboundConfirmTimeEstimation, _renderEstimationTime } from '@/utils/methods';
import { TxResult } from '@/types';
interface IParamsStepItem {
  setStepper: React.Dispatch<React.SetStateAction<string>>,
  stepper: string,
  token: IPool,
  hash: string,
  mode: string
}

const StepperItem = ({ token, hash, mode, stepper, setStepper }: IParamsStepItem) => {
  const [status, setStatus] = React.useState<string>(STATUS.READY);
  const [counter, setCounter] = React.useState<number>(0); 
  const [timeEstimation, setTimeEstimation] = React.useState<number>(0);
  const [txResult, setTxResult] = React.useState<TxResult|undefined>(undefined);
  const [outboundHash, setOutboundHash] = React.useState<string>("");
  const internalStatus = React.useRef<string>(STATUS.PENDING);
  const [mayaMessage, setMayaMessage] = React.useState<string>('');
  const [mayaTitle, setMayaTitle] = React.useState<string>('Processing request in MAYA');
  const [blockHeight, setBlockHeight] = React.useState<number|undefined>(undefined);
  const [mayaResult, setMayaResult] = React.useState<undefined|any>(undefined);
  //timer ref
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const { showNotification } = useNotification ();

  //when mayaResult is available (maya action)
  React.useEffect(() => {
    if (mayaResult) {
      showNotification ("Added Liquidity Successfully", STATUS.SUCCESS);
      setStatus(STATUS.SUCCESS);
    }
  }, [mayaResult]);
  //fetch transaction data from explorer
  const fetchProgress = async(_hash: string) => {
    try {
      const { data: { actions } } = await axios.get(`https://midgard.mayachain.info/v2/actions?txid=${_hash}`);
      if (actions.length === 0) throw "no actions";
      const _action = actions[actions.length - 1]; //get the last element
      if (_action.type === "refund") { 
        showNotification (`Refund, ${_action.metadata.refund.reason}`, "error");
        setStatus(STATUS.FAILED);
        setStepper(STATUS.FAILED);
      } else if (_action.type === "addLiquidity" && internalStatus.current === STATUS.PENDING) { 
        console.log("maya action is pending...");
        setBlockHeight(_action.height);
        internalStatus.current = STATUS.SUCCESS;
      } else if (_action.type === "addLiquidity" && _action.status === STATUS.SUCCESS) {
        setMayaResult(_action);
      }
    } catch (err) {
      console.log("@Ex get transaction from MAYA ---->", err);
    }
  }
  //when estimation is under 0
  React.useEffect(() => {
    if (counter <= 0) {
      // setCounter (timeEstimation);
      clearInterval(timerRef.current as NodeJS.Timeout);
    }
  }, [counter]);
  //2. when status is changed to PENDIND, and hash is available...
  React.useEffect(() => {
    if (status === STATUS.PENDING) {
      let _cnt = 1;
      timerRef.current = setInterval(async() => {
        setCounter(counter => counter - 1);
        if ( _cnt % 5 === 0 ) {
          await fetchProgress(hash);
        }
        _cnt ++;
      }, 1000);
    } else if (status === STATUS.SUCCESS) {
      setStepper(STATUS.SUCCESS);
    }
    return () => {
      clearInterval(timerRef.current as NodeJS.Timeout);
    }
  }, [status, hash]);
  //1. when step is transisted to maya, set status as READY -> PENDING
  React.useEffect(() => {
    if (stepper === "maya") {
      setStatus (STATUS.PENDING);
      // const _timeEstimation = outboundConfirmTimeEstimation(token.chain);
      const _timeEstimation = 1.5*30;
      setCounter (_timeEstimation);
      setTimeEstimation (_timeEstimation);
    }
  }, [stepper]);
  //render counter
  const _renderCounter = React.useMemo(() => {
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
        { status === STATUS.PENDING &&  <span className='dark:text-gray-200'>{_renderCounter}</span> }
        { status === STATUS.SUCCESS && mayaResult &&
          <>
            <span className='dark:text-gray-200'>{_renderLocaleDateTimeString(Number(mayaResult.date)/1e6)}</span>
            <div className='text-[12px] flex gap-1 items-center pb-1'>
              <span className='cursor-pointer hover:underline' onClick={() => window.open(CHAIN_DATA["MAYA"].explorer + '/tx/' + hash, "_blank")}>{reduceAddress(hash, 8)}</span>
              <ClipboardCopier text={hash} size={18}/>
            </div>
            { mayaResult.height && <div className='text-[12px]'>maya block: {mayaResult.height}</div> }
          </> 
        }
      </div>
      <div className={`relative w-1/2 flex flex-col items-start px-7 min-h-[100px]`}>
        <span className='dark:text-gray-200'>
          { status === STATUS.READY && `Process in MAYA` }
          { status === STATUS.PENDING && mayaTitle }  
          { status === STATUS.SUCCESS && `Liquidity Added Successfully` }
          { status === STATUS.FAILED && `MAYA Request Failed` }
        </span>
        <span className='text-[12px]'>
          { status === STATUS.READY &&  `Ready for ${token.ticker}${mode === LIQUIDITY.SYM && '/CACAO'} Liquidity add` }
          { status === STATUS.PENDING &&  
            `Liquidity will be added ${blockHeight ? `by Maya block ${blockHeight}` : ''} within approximately${timeEstimation ? ` ${_renderEstimationTime(timeEstimation)}mins` : '...'}`
          }  
          { status === STATUS.SUCCESS &&  `${token.ticker}${mode === LIQUIDITY.SYM && '/CACAO'} Liquidity added successfully by Maya block ${blockHeight}`}
          { status === STATUS.FAILED &&  `Failed to add Liquidity` }
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