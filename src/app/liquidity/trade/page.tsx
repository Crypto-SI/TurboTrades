"use client"
import React from 'react';
import Image from "next/image";
import { Icon } from '@iconify/react/dist/iconify.js';
import { Dropdown } from 'flowbite-react';
import { useAtom } from "jotai";
import axios from 'axios';
//atoms
import {
  mainPoolsAtom,
  tokenPricesAtom,
  xBalancesAtom
} from '@/store';
//types
import { IDepthPriceHistory, IPool } from '@/types/maya';
import { IBalance } from '@/types/minis';
//data
import { TOKEN_DATA, NATIVE_TOKENS, SUB_LINKS, TOKEN_CHART_CONDS } from '@/utils/data';
//methods
import { reduceAmount, _feeEstimation } from '@/utils/methods';
//hooks
import useNotification from "@/hooks/useNotification";
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
//dynamic import
//import ApexCharts from 'react-apexcharts';
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false })

const data = {
  series: [],
  options: {
    colors:['#F59E0B'],
    chart: {
      type: 'line',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom',
        // offsetX: 100,
        // offsetY: 40,
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    },
    dataLabels: {
      enabled: false // Disable data labels
    },
    stroke: {
      // curve: 'smooth',
      width: 2
    },
    xaxis: {
      scope: 'datetime'
    },
    yaxis: {
      labels: {
        formatter: function (value: number) {
          return reduceAmount(value);
        }
      },
      title: {
        text: 'AssetDepth'
      },
    },
    tooltip: {
      enabled: true, // Enable tooltip,
    }
  }
};

const AddLiquidity = () => {

  //params
  const searchParams = useSearchParams ();
  const asset = searchParams.get("asset");
  //router
  const router = useRouter();
  const pathname = usePathname();
  //atoms
  const [pools,] = useAtom(mainPoolsAtom);
  const [xBalances,] = useAtom(xBalancesAtom);
  //state
  const [selectedPool, setSelectedPool] = React.useState<IPool | undefined>();
  const [selectedTokenPrice, setSelectedTokenPrice] = React.useState<string>("0");
  const [quoteSort, setQuoteSort] = React.useState<string>(TOKEN_CHART_CONDS[3].label);
  const [history, setHistory] = React.useState<IDepthPriceHistory[]>([]);
  //hooks
  const { showNotification } = useNotification();
  /**
   * After fetching pools, set SelectedPool as first pool
   */
  React.useEffect(() => {
    if (pools.length > 0 && asset) {
      // setSelectedPool(pools[0]);
      setSelectedPool(pools.find((_pool: IPool) => _pool.asset === asset));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pools]);
  /**
   * when asset is changed...
   */
  React.useEffect(() => {
    if (asset) {
      const _timestamp = Math.floor(new Date().getTime() / 1000);
      axios.get(`https://midgard.mayachain.info/v2/history/depths/${asset}?interval=day&count=30&to=${_timestamp}`).then((res: any) => {
      // axios.get(`https://midgard.mayachain.info/v2/history/depths/BTC.BTC?interval=day&count=30&to=${_timestamp}`).then((res: any) => {
        setHistory(res.data.intervals);
      });
    } 
  }, [asset])
  /**
   * render SubLink item
   * @param label 
   * @param url 
   * @returns ReactNode
   */
  const _renderSubLink = (label: string, url: string) => (
    <button onClick={() => router.push(`${url}?asset=${asset}`)} key={label} className={`dark:bg-[#111214] bg-white text-[12px] py-[5px] px-3 rounded-lg text-gray-400 hover:dark:text-white hover:dark:bg-black hover:opacity-50 ${pathname === url && 'border  dark:!text-white dark:border-[#cccccc3b] border-[#4b434370] !text-black'}`}>
      {label}
    </button>
  )
  /**
   * render Quote token sort condition
   * @returns React.ReactNode
   */
  const _renderQuoteSort = () => (
    <div className="relative h-8 xs:w-[100px] w-full">
      <div className="absolute dark:text-white grid w-5 h-5 place-items-center text-blue-gray-500 top-2/4 right-3 -translate-y-2/4">
        <Icon icon="iconamoon:arrow-down-2" width="1rem" height="1rem" />
      </div>
      <input
        value={quoteSort}
        onChange={() => {}}
        className="peer !text-[11px] dark:text-white cursor-pointer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 text-sm px-3 py-2.5 !pr-9 border-blue-gray-200 dark:border-gray-600 focus:dark:border-gray-400 focus:border-gray-400 border-gray-200 rounded-full" 
        placeholder="" 
      />
    </div>
  )

  return (
    <div className="flex grow flex-col mt-2">
      <div className='flex gap-1'>
        {SUB_LINKS.map(({ label, url }: { label: string, url: string }) => _renderSubLink(label, url))}
      </div>

      <div className='w-full mt-5 flex flex-col-reverse mw1200:flex-row gap-3'>
        <div className='w-full mw1200:w-auto grow-0 mw1200:grow p-3 dark:bg-[#0B0F16] bg-white rounded-xl'>
          <div className='flex justify-between gap-3 px-3 pt-3 !z-[100000000] flex-col xs:flex-row'>
            <div className='flex items-center gap-2 text-sm'>
              <Image
                src={TOKEN_DATA[asset as string].image}
                width={40}
                height={40}
                alt={"sun"}      
                className='rounded-xl'
              />
              <div>
                <p className='dark:text-white'>{TOKEN_DATA[asset as string].ticker}</p>
                <p className='dark:text-[#ccc] opacity-75'>{TOKEN_DATA[asset as string].name}</p>
              </div>
            </div>
            {/* <Dropdown label=""  renderTrigger={_renderQuoteSort}>
              {
                TOKEN_CHART_CONDS.map(({label, url}: {label: string, url: string}, index: number) => (
                  <Dropdown.Item key={index} onClick={() => setQuoteSort(label)} className={`flex text-[12px] gap-2 ${label === quoteSort && 'font-bold !text-black'}`}>{label}</Dropdown.Item>
                ))
              }
            </Dropdown> */}
          </div>
          <ApexCharts
            //@ts-ignore
            options={data.options}
            series={[{
              name: 'assetDepth',
              data: history.map((item: IDepthPriceHistory) => item.assetDepth / 10**8)
            }]}
            type="area"
            height={400}
          />
        </div>
        {/* <div className='w-full mw1200:w-[320px] opacity-70 dark:text-white'>
          <div className='p-4 dark:bg-[#0B0F16] bg-white rounded-xl'>
            <h5 className='border-b border-dashed p-1 dark:border-gray-800 border-gray-200 font-bold'>My Information</h5>
            <div className='p-1 text-sm mt-2 font-bold flex gap-1 items-center'>
              <Icon icon="ph:currency-eth-fill" width="1rem" height="1rem"/>
              My Balance
            </div>
            <div className='p-1 text-sm mt-2 font-bold flex gap-1 items-center'>
              <Icon icon="ph:currency-eth-fill" width="1rem" height="1rem"/>
              My Liquidity
            </div>
            <div className='p-1 text-sm mt-2 font-bold flex gap-1 items-center'>
              <Icon icon="svg-spinners:clock" width="1rem" height="1rem"/>
              Pending Tokens
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default AddLiquidity;