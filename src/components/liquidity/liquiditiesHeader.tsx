"use client"
import React from 'react';
import { Dropdown } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useAtom } from "jotai";
//atoms
import {
  mainPoolsAtom,
  tokenPricesAtom
} from '@/store';
//types
import { IPool } from '@/types/maya';
//data
import { LIQUIDITY_SORT_CONDS } from '@/utils/data';
 
interface IProps{
  keyword: string,
  setKeyword: React.Dispatch<React.SetStateAction<string>>,
  onlyMyPools: boolean,
  setOnlyMyPools: React.Dispatch<React.SetStateAction<boolean>>,
  sort: string,
  setSort: React.Dispatch<React.SetStateAction<string>>,
}


const Header = ({setKeyword, keyword, onlyMyPools, setOnlyMyPools, sort, setSort}: IProps) => {
  /**
   * render Sort condition dropdown
   * @returns ReactNode
   */
  const _renderSortCondition = () => (
    <div className="relative h-8 sm:w-40 w-full">
      <div className="absolute grid w-5 h-5 place-items-center text-blue-gray-500 top-2/4 right-3 -translate-y-2/4">
        <Icon icon="iconamoon:arrow-down-2" width="1rem" height="1rem" />
      </div>
      <input
        value={sort}
        onChange={() => {}}
        className="peer !text-[11px] cursor-pointer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 text-sm px-3 py-2.5 !pr-9 border-blue-gray-200 dark:border-gray-600 focus:dark:border-gray-400 focus:border-gray-400 border-gray-200 rounded-full" 
        placeholder="" 
      />
    </div>
  )
  return (
    <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full grow">
      <div className="rounded-2xl justify-between p-[9px] bg-white dark:bg-[#0B0F16] dark:text-white flex flex-col xs:flex-row gap-3 xs:items-center relative">
        <div className='flex items-center pl-3'>Liquidity</div>
        <div className='flex gap-2 flex-col xs:flex-row'>
          <div className="relative h-8 sm:w-40 w-full">
            <div className="absolute grid w-5 h-5 place-items-center text-blue-gray-500 top-2/4 right-3 -translate-y-2/4">
              <Icon icon="clarity:search-line" width="1rem" height="1rem" />
            </div>
            <input
              className="peer !text-[11px] w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 text-sm px-3 py-2.5 !pr-9 border-blue-gray-200 dark:border-gray-600 focus:dark:border-gray-400 focus:border-gray-400 border-gray-200 rounded-full" 
              placeholder="Filter Pools" 
              value={keyword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
            />
          </div>
          <Dropdown label=""  renderTrigger={_renderSortCondition}>
            {
              LIQUIDITY_SORT_CONDS.map(({label, condition}: {label: string, condition: string}, index: number) => (
                <Dropdown.Item key={index} onClick={() => setSort(label)} className={`flex text-[12px] gap-2 ${label === sort && 'font-bold !text-black'}`}>{label}</Dropdown.Item>
              ))
            }
          </Dropdown>
          <button onClick={() => setOnlyMyPools(!onlyMyPools)} className="peer sm:w-40 w-full !text-[11px] cursor-pointer px-3 h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 text-sm p-1 border-blue-gray-200 dark:border-gray-600 focus:dark:border-gray-400 focus:border-gray-400 border-gray-200 rounded-full">
            { onlyMyPools ? "Show All": "Show My Pools" }
          </button>
          
        </div>
        {/* <Icon onClick={refresh} icon="el:refresh" className={`mr-1 hover:opacity-50 cursor-pointer absolute ${isFetching && "spin"}`}/> */}
      </div>
    </div>
  )
}

export default Header;