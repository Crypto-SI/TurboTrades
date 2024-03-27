/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Icon } from '@iconify/react';
import ClipboardCopier from '@/components/share/copyToClipboard';
import { _feeEstimation, _reduceHash, reduceAddress, reduceAmount, sleep, CHAINS } from '@/utils/methods';
import useNotification from '@/hooks/useNotification';
import axios from 'axios';
import { CHAIN_DATA } from '@/utils/data';
import { STATUS } from '@/utils/constants';
import { IPool } from '@/types/maya';
import { _renderLocaleDateTimeString, inboundConfirmTimeEstimation, outboundConfirmTimeEstimation, _renderEstimationTime } from '@/utils/methods';
import { TxResult } from '@/types';
interface IParamsStepItem {
  setStepper: React.Dispatch<React.SetStateAction<string>>,
  stepper: string,
  fromToken: IPool,
  toToken: IPool,
  hash: string,
}

const StepperItem = ({ toToken, fromToken, hash, stepper, setStepper }: IParamsStepItem) => {
  const [status, setStatus] = React.useState<string>(STATUS.READY);
  const [counter, setCounter] = React.useState<number>(0); 
  const [timeEstimation, setTimeEstimation] = React.useState<number>(0);
  const [txResult, setTxResult] = React.useState<TxResult|undefined>(undefined);
  const [outboundHash, setOutboundHash] = React.useState<string>("");
  const internalStatus = React.useRef<string>(STATUS.PENDING);
  const [mayaMessage, setMayaMessage] = React.useState<string>('');
  const [mayaTitle, setMayaTitle] = React.useState<string>('Processing request in MAYA');
  const [blockHeight, setBlockHeight] = React.useState<number|undefined>(undefined);
  const [mayaResult, setMayaResult] = React.useState<any>();
  //timer ref
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const { showNotification } = useNotification ();

  const _fetchOutboundTx = async (hash: string) => {
    if (mayaResult.out[0].coins[0].asset === "MAYA.CACAO") {
      setTxResult({
        hash: hash,
        url: CHAIN_DATA['MAYA'].explorer + '/tx/' + hash,
        confirmed: true,
        blocktime: Number(mayaResult.date)/1e6,
        blockHeight: mayaResult.height,
        gas: 0,
        fee: 0
      });
    } else {
      for (let i = 0; i < 10; i++) {
        try {
          const _txResult: TxResult = await CHAINS[toToken.chain].getTransaction(outboundHash);
          //console.logg(_txResult)
          setTxResult(_txResult);
          break;
        } catch (err) { }
        await sleep (5000);
      }
    }
  } 
  //when txResult is available
  React.useEffect(() => {
    if (txResult?.confirmed) {
      showNotification ("Swap Success", STATUS.SUCCESS);
      setStatus(STATUS.SUCCESS);
    }
  }, [txResult]);
  //when outbondTx is available
  React.useEffect(() => {
    if (outboundHash) {
      _fetchOutboundTx (outboundHash);
    }
  }, [outboundHash])
  //fetch transaction data from explorer
  const fetchProgress = async(_hash: string) => {
    try {
      const { data: { actions } } = await axios.get(`https://midgard.mayachain.info/v2/actions?txid=${_hash}`);
      if (actions.length === 0) throw "no actoins";
      const _action = actions[actions.length - 1]; //get the last element
      if (_action.type === "refund") { 
        setStatus(STATUS.FAILED);
        setStepper(STATUS.FAILED);
      } else if (_action.type === "swap" && internalStatus.current === STATUS.PENDING) { 
        //console.logg(_action)
        const _timeEstimation = outboundConfirmTimeEstimation(toToken.chain);
        setBlockHeight(_action.height);

        setMayaTitle(`${toToken.ticker} is on its way to your wallet`);
        setMayaMessage(`${toToken.ticker} is on its way to your wallet via maya block ${_action.height}, it will arrive within approximately ${_renderEstimationTime(_timeEstimation)}mins`);
        
        setTimeEstimation(_timeEstimation);
        setCounter(_timeEstimation);

        internalStatus.current = STATUS.SUCCESS;
      } else if (_action.type === "swap" && _action.status === STATUS.SUCCESS) {
        // setMayaMessage(`${toToken.ticker} reached by maya block ${_action.height}`);
        setOutboundHash(_action.out[0].txID ? _action.out[0].txID : hash);
        setMayaResult(_action);
      }
    } catch (err) {
      //console.logg("@Ex get transaction from MAYA ---->", err);
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
      setCounter (30);
      setTimeEstimation (30);
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
        { status === STATUS.SUCCESS && txResult &&
          <>
            <span className='dark:text-gray-200'>{_renderLocaleDateTimeString(txResult.blocktime)}</span>
            <div className='text-[12px] flex gap-1 items-center pb-1'>
              <span className='cursor-pointer hover:underline' onClick={() => window.open(CHAIN_DATA[toToken.chain].explorer + '/tx/' + outboundHash, "_blank")}>{reduceAddress(outboundHash, 8)}</span>
              <ClipboardCopier text={outboundHash} size={18}/>
            </div>
            { txResult.blockHeight && <div className='text-[12px]'>block: {txResult.blockHeight}</div> }
            { txResult.confirmations && <div className='text-[12px]'>confimrations: {txResult.confirmations}</div> }
            { txResult.fee > 0 && <div className='text-[12px]'>fee: {txResult.fee}{toToken.ticker}</div> }
          </> 
        }
      </div>
      <div className={`relative w-1/2 flex flex-col items-start px-7 min-h-[100px]`}>
        <span className='dark:text-gray-200'>
          { status === STATUS.READY && `Process in MAYA` }
          { status === STATUS.PENDING && mayaTitle }  
          { status === STATUS.SUCCESS && `${toToken.ticker} Reached Successfully` }
          { status === STATUS.FAILED && `MAYA Request Failed` }
        </span>
        <span className='text-[12px]'>
          { status === STATUS.READY &&  `Ready for ${fromToken.ticker}/${toToken.ticker} swap` }
          { status === STATUS.PENDING &&  
            (!mayaMessage ? `MAYA Swap will be processed within approximately${timeEstimation ? ` ${_renderEstimationTime(timeEstimation)}mins` : '...'}` : mayaMessage)
          }  
          { status === STATUS.SUCCESS &&  `Payment reached your wallet by Maya block ${blockHeight}`}
          { status === STATUS.FAILED &&  `Failed to outbound` }
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