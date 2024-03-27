"use client"
import Image from "next/image";
import React from 'react';
import { useTheme } from "next-themes";
import { Icon } from '@iconify/react';
import { useAtom } from "jotai";
import { Dropdown } from 'flowbite-react';
//atom from store
import {
  currentModalTypeAtom, isConnectingAtom,
  xBalancesAtom,
  walletAtom,
  curBalanceAtom
} from '@/store';
//router
import { useRouter } from "next/navigation";
//types
import { IWallet } from '@/types/minis';
//data
import { CHAIN_DATA } from '@/utils/data';
import { reduceAmount } from "@/utils/methods";
//hooks
import useAutoConnect from "@/hooks/useAutoConnect";

const Header = () => {

  //state
  const [visible, setVisible] = React.useState<Boolean>(false);
  //router
  const router = useRouter ();
  //atoms
  const [, setCurrentModalType] = useAtom(currentModalTypeAtom);
  const [isConnecting] = useAtom(isConnectingAtom);
  const [xBalances] = useAtom(xBalancesAtom);
  const [curBalance, setCurBalance] = useAtom(curBalanceAtom);
  //hooks
  const { theme } = useTheme();
  const { disconnectWallet } = useAutoConnect ();

  React.useEffect(() => {
    const keys = Object.keys(xBalances);
    if (keys.length > 0) {
      setCurBalance(xBalances[keys[0]])
    } else {
      setCurBalance(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xBalances]);
  //show toggle
  const handleToggle = () => {
    setVisible(prev => !prev);
  }
  //to connect page
  const handleToConnectPage = () => {
    setCurrentModalType("");
    router.push("/connect-wallet");
  }
  //disconnect wallet
  const handleDisconnect = async () => {
    disconnectWallet ();
  }
  //render profile button
  const _profileButton = () => (
    <div className="cursor-pointer flex gap-2 items-center justify-center rounded-full px-5 py-2 text-4 w-full bg-white dark:bg-black dark:text-white text-black dark:hover:text-[#ccc] hover:text-[#ccc]">
      <div>Wallet:</div>
      <Image
        className='cursor-pointer rounded-full'
        src={CHAIN_DATA[curBalance?.chain as string] ? CHAIN_DATA[curBalance?.chain as string].image as string : ""}
        width={33}
        height={33}
        alt={"refresh"} 
        priority={true}
      />
      <div>
        <div>
          { String(curBalance?.balance[0].amount).substr(0, 10) }
        </div>
        <div className="dark:text-[#8D98AF] text-[12px]">
          $ { reduceAmount(Number(curBalance?.balance[0].amount) * Number(curBalance?.balance[0].value)) } USD
        </div>
      </div>
      <Icon icon="mdi:keyboard-arrow-down" width={20}/>
    </div>
  )

  const _renderProfile = () => (
    <Dropdown label="" renderTrigger={_profileButton}>
      <Dropdown.Item onClick={handleToConnectPage}><Icon icon="gg:add" className="mr-2" width={26}/>Add chain</Dropdown.Item>
      <Dropdown.Divider />
      {
        Object.keys(xBalances).map((key:string, index: number) => (
          <Dropdown.Item onClick={() => setCurBalance(xBalances[key])} key={"chain_" + index} className="flex gap-3">
            <Image
              className='cursor-pointer rounded-full'
              src={CHAIN_DATA[xBalances[key].chain as string].image}
              width={22}
              height={22}
              alt={"refresh"} 
              priority={true}
            /> {CHAIN_DATA[xBalances[key].chain as string].name}
          </Dropdown.Item>
        ))
      }
      <Dropdown.Divider />
      <Dropdown.Item onClick={handleDisconnect}><Icon icon="tabler:logout" className="mr-2" width={26}/>Disconnect</Dropdown.Item>
    </Dropdown>
  )

  return (
    <div className="bg-white dark:bg-black border-[#e2e2e2] dark:border-[#1c1c1c] border rounded-2xl p-4 px-8">
      <div className="flex justify-between items-center">
        <Image
          src={ theme === "dark" ?  '/images/logo-light.png' : "/images/logo-dark.svg" }
          width={100}
          height={20} 
          alt={"logo"}  
          priority={true}     
        />
        <div className="flex xs:hidden items-center justify-center cursor-pointer" onClick={handleToggle}>
          <Icon icon="ph:list" className="dark:text-white text-black" height={30}/>
        </div>
        <div className={`items-center hidden xs:flex xs:w-auto`}>
          <div className="rounded-full p-[1px] bg-gradient-to-r w-full from-[#FF6802] to-[#EE0E72]">
            {
              !curBalance ?
              <button onClick={handleToConnectPage} className="flex gap-2 items-center justify-center rounded-full px-5 py-2 text-4 w-full bg-white dark:bg-black dark:text-white text-black dark:hover:text-[#ccc] hover:text-[#ccc]" >
                { isConnecting ? <>Connecting <Icon icon="eos-icons:bubble-loading" /></> : "Connect Wallet" }
              </button> : _renderProfile()
            }
          </div>
        </div>
      </div>
      <div className={`mt-5 w-full inline-block xs:hidden ${!visible && 'hidden'}`}>
        <div className="rounded-full p-[1px] bg-gradient-to-r w-full from-[#FF6802] to-[#EE0E72]">
        {
          !curBalance ?
          <button onClick={handleToConnectPage} className="flex gap-2 items-center justify-center rounded-full px-5 py-2 text-4 w-full bg-white dark:bg-black dark:text-white text-black dark:hover:text-[#ccc] hover:text-[#ccc]" >
            { isConnecting ? <>Connecting <Icon icon="eos-icons:bubble-loading" /></> : "Connect Wallet" }
          </button> : _renderProfile()
        }
        </div> 
      </div>
    </div>
  );
};

export default Header;
