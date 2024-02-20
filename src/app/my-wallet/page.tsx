"use client"
import React from 'react';
import Image from "next/image";
import { Icon } from '@iconify/react';
import { Tooltip } from 'flowbite-react';
import { useAtom } from 'jotai';
import { IWallet, IBalance } from '@/types/minis';
import QRCode from 'react-qr-code';
//utils
import { reduceAddress, reduceAmount } from '@/utils/methods';
//atoms
import {
  isConnectingAtom,
  chainListAtom,
  xBalancesAtom,
  xClientsAtom,
  xDefiAddressesAtom,
  walletAtom
} from '@/store';

import { ChainType } from '@/types/minis';
//hook
import useXChain from '@/hooks/useXChain';
import useXDefi from "@/hooks/useXDefiWallet";

import { TOKEN_DATA } from '@/utils/data';

const Home = () => {
  //atoms  
  const [xBalances] = useAtom(xBalancesAtom);
  const [xClients,] = useAtom(xClientsAtom);
  const [isConnecting, ] = useAtom(isConnectingAtom);
  const [xDefiAddresses, ] = useAtom(xDefiAddressesAtom);
  const [wallet, ] = useAtom(walletAtom);
  const [chainList,] = useAtom(chainListAtom);//selected chains
  //states
  const [qrAddress, setQRAddress] = React.useState<string>("");
  const [showQRCode, setShowQRCode] = React.useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = React.useState<boolean>(false);

  //hooks methods
  const { getBalances } = useXChain ();
  const { getBalancesWithXDefi } = useXDefi();
  //chains that is selected at this moment
  const chains: ChainType[] = chainList.filter((_chain: ChainType) => _chain.selected ).map((_chain: ChainType) => _chain);
  //get token balance by chainName
  const _getTokenBalances = React.useCallback(async(chain: string) => {

  }, [])
  //refresh all chains
  const handleRefresh = async () => {
    try {
      if (isRefreshing) throw "already refreshed...";
      setIsRefreshing(true);
      if ( wallet?.name === "Keystore" ) {
        await getBalances ();
      } else {
        await getBalancesWithXDefi ();
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsRefreshing(false);
    }
  }
  //get tokens balances using keystore wallet
  // React.useEffect(() => {
  //   console.log("@dew1204/keystore ---------------------->", Object.keys(xClients).length, wallet?.name)
  //   if (Object.keys(xClients).length > 0 && wallet?.name === "Keystore") {
  //     getBalances ();
  //   }
  // }, [Object.keys(xClients).length]);
  // //load balances using xDefi wallet
  // React.useEffect(() => {
  //   console.log("@dew1204/xdefi ---------------->", xDefiAddresses, wallet?.name);
  //   if (Object.keys(xDefiAddresses).length > 0 && wallet?.name === "XDEFI") {
  //     getBalancesWithXDefi ();
  //   }
  // }, [Object.keys(xDefiAddresses).length]);
  
  

  
  const handleShowQRCode = (_address: string) => {
    setQRAddress(_address);
    setShowQRCode(true);
  }

  const _renderWallet = (_chain: ChainType, index: number) => (
    <div key={"my_wallet_" + index + ""} className='mt-3'>
      <div className='dark:bg-[#1f242ea1] bg-[#1f242e21] p-2 px-4 flex gap-2 md:gap-4 items-center text-[13px]'>
        <span>{index + 1 + ""}.</span>
        {
          xBalances[_chain.label] && 
          <Tooltip content={`Connected with ${xBalances[_chain.label].walletType}`} style="dark">
            <Image
              className='cursor-pointer'
              src={`/images/${xBalances[_chain.label].walletType}.svg`}
              width={18}
              height={18}
              alt={"refresh"}
              priority={true}
            />
          </Tooltip>
        }
        <Tooltip content={_chain.name} style="dark">
          <Image
            className='cursor-pointer'
            src={_chain.image}
            width={18}
            height={18}
            alt={"refresh"}
            priority={true}
          />
        </Tooltip>
        
        <span>{ _chain.label }</span>
        {
          !xBalances[_chain.label] ? <div className="h-6 bg-gray-300 dark:bg-[#000000] grow mr-[40%] rounded-full animate-pulse"></div> : 
          <>
            <span>{ xBalances[_chain.label] && reduceAddress(xBalances[_chain.label].address) }</span>
            <Tooltip content="Copy address" style="dark"><Icon icon="solar:copy-line-duotone" className='cursor-pointer hover:opacity-50' width={20} /></Tooltip>
            <Tooltip content="Show QR code" style="dark"><Icon onClick={() => handleShowQRCode(xBalances[_chain.label] ? xBalances[_chain.label].address : "0x00000000000000")} icon="grommet-icons:qr" className='cursor-pointer hover:opacity-50' width={20} /></Tooltip>
          </>
        }
      </div>
      {
        !xBalances[_chain.label] ? <div className="h-10 bg-gray-300 dark:bg-[#171A23] w-grow m-4 rounded-full animate-pulse"></div> :
        xBalances[_chain.label].balance.map((item: IBalance, index: number) => (
          <div key={"balance_" + index} className='justify-between border-b dark:border-[#2B2E41] border-[#DCE4EF] w-full pl-7 py-3 pr-4 flex items-center dark:text-[#A6A9B9] text-[#A6A9B9]'>
            <div className="flex items-center md:gap-4 gap-2">
              <Image
                src={TOKEN_DATA[`${item.chain}.${item.ticker}`] ? TOKEN_DATA[`${item.chain}.${item.ticker}`].image : ""}
                width={38}
                height={38}
                alt={"refresh"}
                priority={true}
                className='rounded-full'
              />
              <span>{item.symbol}</span>
              <span>
                {  reduceAmount (item.amount)  }
                &nbsp;&nbsp;( { reduceAmount(Number(item.amount) * Number(item.value)) }$ )
              </span>
            </div>
            <Tooltip content="Send"><button className='bg-[#1f242e11] dark:bg-[#1f242ea1] rounded-xl p-3 hover:opacity-50'><Icon icon="fa:send" width={16} /></button></Tooltip>
          </div>
        ))
      }
    </div>
  )

  const _renderQRCode = () => (
    <div className={`${ !showQRCode && "hidden" }`}>
      <div onClick={() => { setShowQRCode(false) }} className="fixed top-0 left-0 right-0 bottom-0 bg-[#0000003d] z-10 backdrop-filter backdrop-blur-[10px]"></div>
      <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-xl z-20'>
        <QRCode
          value={qrAddress}
          bgColor={"#000000"}
          fgColor={"#FFFFFF"}
          size={250}
        />
        <span className='absolute t-full left-1/2 -translate-x-1/2 mt-7 dark:text-white text-sm'>{qrAddress}</span>
      </div>
    </div>
  )

  return (
    <div className="flex-grow flex justify-center items-center">
      {
        _renderQRCode()
      }
      <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full md:w-[calc(100vw-360px)] lg:w-[680px]">
        <div className="rounded-2xl px-5 py-6 bg-white dark:bg-[#0A0C0F] dark:text-white">
          <div className='flex justify-between items-center'>
            <h2 className='text-lg'>My Wallet</h2>
            <div className='flex gap-2'>
              <Image
                src="/images/refresh.svg"
                width={38}
                height={38}
                alt={"refresh"}
                priority={true}
                className={`cursor-pointer hover:opacity-50 ${(isRefreshing || isConnecting) && "spin"}`}
                onClick={handleRefresh}
              />
              <Image
                src="/images/add.svg"
                width={38}
                height={38}
                alt={"refresh"}
                priority={true}
                className='cursor-pointer hover:opacity-50'
              />
            </div>
          </div>
          {
            chains.map((_chain: ChainType, index: number) => _renderWallet(_chain, index))
          }
        </div>
      </div>
    </div>
  )
}

export default Home;