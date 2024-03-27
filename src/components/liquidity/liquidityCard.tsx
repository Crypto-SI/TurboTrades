"use client"
import React from 'react';
import ApexCharts from 'react-apexcharts';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
//types
import { IPool, ILP, IDepthPriceHistory } from '@/types/maya';
import { reduceAmount } from '@/utils/methods';

const _data = {
  name: 'series1',
  data: [31, 40, 28, 51, 42, 40],
};

const data = {
  series: [{
    name: 'series1',
    data: [31, 40, 28, 51, 42, 40],
  }],
  options: {
    colors:['#F59E0B'],
    chart: {
      type: 'line',
      toolbar: {
        show: false // Hide toolbar
      },
      zoom: {
        enabled: false // Disable zooming
      },
      selection: {
        enabled: false // Disable selection
      },
      pan: {
        enabled: false // Disable panning
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
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      labels: {
        show: false // Hide x-axis labels
      },
      axisBorder: {
        show: false // Hide x-axis border
      },
      tooltip: {
        enabled: false // Disable x-axis tooltip
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      show: false // Hide y-axis
    },
    grid: {
      show: false // Hide grid lines
    },
    tooltip: {
      enabled: false // Disable tooltip
    }
  }
};
//props interface
interface IProps {
  pool: IPool
}

const LiquidityChart = ({ pool }: IProps) => {
  //router
  const router = useRouter ();

  const _renderDropdownButton = () => (
    <button
      id="dropdownDefaultButton"
      className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 text-center inline-flex items-center dark:hover:text-white"
      type="button"
    >
      {  }
    </button>
  )
  return (
    <div className="bg-white rounded-2xl shadow dark:bg-[#0B0F16] dark:border-t dark:border-l dark:border-[#1A3F44] cursor-pointer hover:bg-gradient-to-br from-white to-[#00343b21] hover:dark:from-black hover:dark:to-[#00343B]">
      <div onClick={() => router.push(`/liquidity/trade?asset=${pool.asset}`)}>
        <div className='flex justify-between p-3'>
          <div className='flex gap-2 items-center'>
            <div className='relative'>
              <Image
                src={pool ? String(pool.image) : '/images/tokens/cacao.png'}
                width={40}
                height={40}
                alt={"sun"}
                className='rounded-xl' 
                priority={true}     
              />
            </div>
            <div className='text-sm dark:text-white'>
              <p className='font-bold'>{ pool?.ticker }</p>
              <p className='text-[12px] opacity-50'>{ pool?.name }</p>
            </div>
          </div>
          <div className='text-sm dark:text-white text-right'>
            <p className='text-green-500 font-bold'>{ (Number(pool?.annualPercentageRate) * 100).toFixed(2) }%</p>
            <p className='text-[12px] opacity-50'>APR</p>
          </div>
        </div>
        <div className="w-full text-center">
          <div className='text-center'>
            <h5 className="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">
              $ { Number(pool.assetPriceUSD).toFixed(2) }
            </h5>
            <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
              1 {pool?.ticker}
            </p>
          </div>
        </div>
        <ApexCharts 
          //@ts-ignore
          options={data.options} 
          series={[{
            ..._data,
            data: pool.depthHistory ? pool.depthHistory.map((item: IDepthPriceHistory) => item.assetDepth) : _data.data
          }]} 
          type="area" 
          height={170} 
        />
        <div className='flex justify-between px-10 -mt-3 !text-sm'>
          <div className='text-center'>
            <div className='dark:text-white text-black font-bold'>{ reduceAmount(Number(pool.volume24h) / 10**10) }</div>
            <div className='text-[13px] dark:text-gray-500'>24h</div>
          </div>
          <div className='text-center'>
            <div className='dark:text-white text-black font-bold'>{ reduceAmount(2 * Number(pool.assetPriceUSD) * Number(pool.assetDepth) / 10**8) }</div>
            <div className='text-[13px] dark:text-gray-500'>Liquidity</div>
          </div>
        </div>
      </div>
      <div className='flex justify-between py-3 px-4'>
        <button onClick={() => router.push("/")} className='flex gap-1 items-center dark:bg-[#162F35] rounded-lg text-[12px] py-1 px-2 dark:text-white bg-[#a5adaf63] hover:opacity-70'>
          Swap<Icon icon="flat-color-icons:currency-exchange" width={18}/>
        </button>
        <button onClick={() => router.push('/liquidity/add?asset=' + pool.asset)} className='flex gap-1 items-center dark:bg-[#162F35] rounded-lg text-[12px] py-1 px-2 dark:text-white bg-[#a5adaf63] hover:opacity-70'>
          Add Liquidity<Icon icon="la:cart-plus" width={15}/>
        </button>
      </div>
    </div>
  )
}

export default LiquidityChart;