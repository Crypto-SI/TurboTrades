"use client"
import React from 'react';
import axios from "axios";
import Image from "next/image";
import { Icon } from '@iconify/react';
//@ts-ignore
import moment from 'moment';
//components
import ClipboardCopier from '@/components/share/copyToClipboard';
//data
import {
  TOKEN_DATA
} from "@/utils/data";
//types
import { IPool, ICoin, ITnx, IAction } from "@/types/maya";
//utils
import { reduceAmount, _feeEstimation, reduceAddress } from "@/utils/methods";
//hooks
import useNotification from "@/hooks/useNotification";
//router
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

const Progress = () => {
  //hooks
  const { showNotification } = useNotification ();
  //router
  const pathname = usePathname ();
  // liquidity/add/ETH.ETH
  const searchParams = useSearchParams (); 
  const params: {
    hash: string | null,
    from: string | null,
    in: string | null,
    ina: string | null,
    outa: string | null,
    out: string | null,
    start: string | null,
  } = { 
    hash: searchParams.get("hash"),
    from: searchParams.get("from"),
    in: searchParams.get("in"),
    ina: searchParams.get("ina"),
    out: searchParams.get("out"),
    outa: searchParams.get("outa"),
    start: searchParams.get("start"),
  }

  //timer ref
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const statusRef = React.useRef<string>("pending");
  //state
  const [counter, setCounter] = React.useState<number>(0); 
  const [action, setAction] = React.useState<IAction | undefined>(undefined);
  const [successActions, setSuccessAction] = React.useState<IAction | undefined>(undefined);
  const [result, setResult] = React.useState<string>("");
  const [errMessage, setErrMessage] = React.useState<string>("");
  
  /**
   * open new window for observing transaction...
   * @param url 
   */
  const _gotoHash = (url: string) => {
    if (window) {
      window.open(url, "_blank");
    }
  }
  /**
   * fetch the progress status
   */
  const _fetchProgress = async() => {
    try {
      // console.log(params)
      const { data } = await axios.get(`https://midgard.mayachain.info/v2/actions?address=${params.from}&txid=${params.hash}`);
      const actions: any[] = data?.actions;
      if (actions.length !== 1) throw "";
      const action = actions[0];
      setAction (action);
      statusRef.current = action.status;
    } catch (err){
      console.log("@err from fetch action data using mayainfo", err);
    }
  }
  /**
   * when action is changed...
   */
  React.useEffect(() => {
    try {
      if (!action) throw "";
      
      if (action.type === "addLiquidity") { //if success sort the transactions...
        let tnxs: ITnx[] = [];
        let _in: ITnx | undefined = undefined;
        let _out: ITnx | undefined = undefined;
        action.in.forEach((item: ITnx) => {
          if (item.address.substring(0,4) === "maya") {
            _out = item;
          } else {
            _in = item;
          }
        });
        if (_in) {
          tnxs = [_in];
          if (_out) tnxs = [...tnxs, _out];
        }
        console.log("@add liqudity succcess result -------------", tnxs);
        setResult (action.type);
        setSuccessAction ({ ...action, in: tnxs });
        showNotification ("Successfull added liquidity", "success");
      } else {
        setResult (action.type);
        const message = action.metadata[action.type]?.reason;
        setErrMessage (message);
        showNotification (action.type, "info");
      }
    } catch (err) { }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);
  /**
   * timer set
   */
  React.useEffect(() => {
    let cnt = 5;
    let loading = false;
    timerRef.current = setInterval(async() => {
      if (statusRef.current !== "pending") { //if status is not pending, clear interval
        clearInterval(timerRef.current as NodeJS.Timeout);
      }
      cnt++;
      if (cnt % 5 === 0 && !loading) {
        loading = true;
        await _fetchProgress ();
        loading = false;
      }
      setCounter(counter => counter + 1);
    }, 1000);

    return () => {
      clearInterval(timerRef.current as NodeJS.Timeout);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   * render transaction hash item
   * @param name Name
   * @param hash Tx Hash
   * @param url Tx url
   * @returns ReactNode
   */
  const _renderTxInfo = (name: string, hash: string, url: string) => (
    <div className='flex justify-between items-center text-sm my-3'>
      <div className=''>{name}</div>
      <div className='flex gap-1 items-center'>
        <span onClick={() => _gotoHash (url)} className='hover:underline cursor-pointer text-[#cfab5d]'>{ reduceAddress(hash, 8) }</span>
        <ClipboardCopier text={url}/>
      </div>
    </div>
  )
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
  
  return (
    <div className="flex-grow flex justify-center items-center sm:pl-0 md:pl-3">
      <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full lg:w-[500px]">
        <div className="rounded-2xl p-4 bg-white dark:bg-[#0A0C0F] dark:text-white text-black">
          <div className='flex justify-between items-end px-2'>
            <h2 className='px-1 pt-2 font-bold text-lg'>Tx Tracker</h2>
            <h3 className='text-sm'>{ _renderCounter }</h3>
          </div>
          <div className="bg-[#F3F7FC] dark:text-[#dbdde0] dark:bg-[#030506] w-full rounded-xl mt-1 p-5">
            <div className='flex justify-between items-center text-sm'>
              <div className=''>Status</div>
              <div className='flex gap-1 item-center'>
                { statusRef.current === "pending" && "Pending" } { result && result }
                { statusRef.current === "pending" && <Icon icon="line-md:downloading-loop" width="1.2rem" height="1.2rem"/> }
                { statusRef.current === "success" && <Icon icon="icon-park-solid:database-success" width="1.2rem" height="1.2rem"/> }
              </div> 
            </div>
            <div className='flex justify-between items-center text-sm my-5'>
              <div className=''>Add</div>
              <div className='flex items-center gap-2'>
                {
                  successActions && successActions.in.length > 0 ?
                  <>
                    <div className='flex gap-1 items-center'>
                      <Image
                        src={TOKEN_DATA[successActions.in[0]?.coins[0]?.asset]?.image}
                        width={35}
                        height={35}
                        alt={"sun"}  
                        priority={true}     
                      />
                      { reduceAmount(Number(successActions.in[0]?.coins[0]?.amount) / 10**8) } { TOKEN_DATA[successActions.in[0]?.coins[0]?.asset]?.ticker }
                    </div>
                    {
                      successActions.in.length === 2 &&
                      <>
                        <Icon icon="flat-color-icons:currency-exchange" width="1.5rem" height="1.2rem" />
                        <div className='flex gap-1 items-center'>
                          <Image
                            src="/images/tokens/cacao.png"
                            width={35}
                            height={35}
                            alt={"sun"}       
                            priority={true}
                          />
                          { reduceAmount(Number(successActions.in[1]?.coins[0]?.amount) / 10**10) } CACAO
                        </div>
                      </>
                    }
                  </> :
                  <>
                    { 
                      params.in &&
                      <div className='flex gap-1 items-center'>
                        <Image
                          src={TOKEN_DATA[params.in]?.image}
                          width={35}
                          height={35}
                          alt={"sun"}    
                          priority={true}   
                        />
                        { reduceAmount(params.ina) } { TOKEN_DATA[params.in]?.ticker }
                      </div>
                    }
                    {
                      params.out &&
                      <>
                        <Icon icon="flat-color-icons:currency-exchange" width="1.5rem" height="1.2rem" />
                        <div className='flex gap-1 items-center'>
                          <Image
                            src="/images/tokens/cacao.png"
                            width={35}
                            height={35}
                            alt={"sun"}  
                            priority={true}     
                          />
                          { reduceAmount(params.outa) } CACAO
                        </div>
                      </>
                    }
                  </>
                }
              </div>
            </div>
            {
              successActions && successActions.in.length > 0 &&
              <>
               { _renderTxInfo ("In Address", successActions.in[0].address, TOKEN_DATA[successActions.in[0].coins[0].asset].explorer + '/address/' + successActions.in[0].address) }
               { _renderTxInfo ("In TxHash", successActions.in[0].txID, TOKEN_DATA[successActions.in[0].coins[0].asset].explorer + '/tx/' + successActions.in[0].txID) } 
                <div className='flex justify-between items-center text-sm my-3 mb-6'>
                  <div className=''>In Time</div>
                  <div className='flex gap-1 items-center pr-2'>
                    { successActions && moment(Number(successActions.date) / 1000000).format('YYYY:MM:DD HH:MM') }
                  </div>
                </div>
              </>
            }
            {
              successActions && successActions.in.length === 2 &&
              <>
               { _renderTxInfo ("In Address", successActions.in[1].address, TOKEN_DATA[successActions.in[1].coins[0].asset].explorer + '/address/' + successActions.in[1].address) }
               { _renderTxInfo ("In TxHash", successActions.in[1].txID, TOKEN_DATA[successActions.in[1].coins[0].asset].explorer + '/tx/' + successActions.in[1].txID) } 
                <div className='flex justify-between items-center text-sm my-3 mb-6'>
                  <div className=''>In Time</div>
                  <div className='flex gap-1 items-center pr-2'>
                    { successActions && moment(Number(successActions.date) / 1000000).format('YYYY:MM:DD HH:MM') }
                  </div>
                </div>
              </>
            }
          </div>
          {
            errMessage && 
            <div className='text-[#ff3b3b] rounded-xl p-3 px-4 w-full text-sm text-center'>
              { errMessage }
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Progress;