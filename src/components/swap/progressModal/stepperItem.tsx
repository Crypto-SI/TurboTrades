import React from 'react';
import { Icon } from '@iconify/react';
import ClipboardCopier from '@/components/share/copyToClipboard';
import { _reduceHash, reduceAddress } from '@/utils/methods';
// import { HiArrowNarrowRight, HiCalendar } from 'react-icons/hi';
interface IParamsStepItem {
  status: string,
  title: Record<string, string>,
  details: Record<string, string>,
  divider?: boolean,
  hash: string
}


const StepperItem = ({ status, title, details, hash, divider = true }: IParamsStepItem) => {

  //timer ref
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const statusRef = React.useRef<string>("pending");
  //state
  const [counter, setCounter] = React.useState<number>(0); 
  /**
   * timer set
   */
  React.useEffect(() => {
    if (statusRef.current !== "pending" && status === "pending") {
      let cnt = 0;
      timerRef.current = setInterval(async() => {
        if (statusRef.current !== "pending") { //if status is not pending, clear interval
          clearInterval(timerRef.current as NodeJS.Timeout);
        }
        cnt++;
        setCounter(counter => counter + 1);
      }, 1000);
    }
    statusRef.current = status;

    return () => {
      setCounter (0);
      clearInterval(timerRef.current as NodeJS.Timeout);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  /**
   * render time according to the counter
   * 00:10:23
   */
  const _renderCounter = React.useMemo(() => {
    let _hour : number | string = Math.floor(counter / 3600);
    let _minute : number | string = Math.floor((counter % 3600) / 60);
    let _second : number | string = (counter % 3600) % 60;

    _hour = _hour < 10 ? '0' + _hour : _hour;
    _minute = _minute < 10 ? '0' + _minute : _minute;
    _second = _second < 10 ? '0' + _second : _second;
    return `${_hour}:${_minute}:${_second}`
  }, [counter]);

  const [tx] = hash.split("/").reverse();

  return (
    <div className='w-full text-left flex text-gray-500 dark:text-gray-400'>
      <div className='w-1/2 flex flex-col items-end px-7'>
        { status === "ready" && 'Queued' }
        { status === "pending" && _renderCounter }
        { status === "success" && 
          <>
            <span className='dark:text-gray-200'>2024:03:21 20:48</span>
            <div className='text-sm flex gap-1 items-center'>
              <span className='cursor-pointer hover:underline' onClick={() => window.open(hash, "_blank")}>{reduceAddress(tx, 8)}</span>
              <ClipboardCopier text={tx} size={18}/>
            </div>
          </> 
        }
      </div>
      <div className={`relative w-1/2 flex flex-col items-start px-7 dark:border-gray-400 ${ divider && 'min-h-[120px] border-l' } ${ status === 'success' && '!border-blue-200' }`}>
        <span className='dark:text-gray-200'>{ title[status] }</span>
        <span className='text-sm'>{ details[status] }</span>
        <div className='text-3xl absolute left-0 top-0 p-1 rounded-full -translate-x-1/2 -translate-y-2 bg-white dark:bg-[#0A0C0F]'>
          { status === "ready" && <Icon icon="f7:tag-circle" /> }
          { status === "pending" && <div className='spin'><Icon icon="mingcute:loading-fill"/></div> }
          { status === "success" && <Icon icon="tabler:check" className='text-blue-200'/> }
        </div>
      </div>
    </div>
  )
}

export default StepperItem;