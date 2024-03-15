"use client"
import Image from "next/image";
import React, { useMemo } from 'react';
import { Icon } from '@iconify/react';
import { Dropdown } from 'flowbite-react';
//hooks
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from "next-themes";
import { useAtom } from 'jotai';
//methods
import { reduceAmount } from "@/utils/methods";
//atoms
import {
  currentModalTypeAtom, curBalanceAtom, xBalancesAtom
} from '@/store';
import { TOKEN_DATA } from "@/utils/data";
import { CHAIN_DATA } from '@/utils/data';
//social links
const _socialLinks: { img: string, url: string }[] = [
  { img: "/images/twitter.svg", url: "" },
  // { img: "/images/facebook.svg", url: "" },
  { img: "/images/instagram.svg", url: "" }
] 
import useAutoConnect from "@/hooks/useAutoConnect";
//hoosk
import useNotification from "@/hooks/useNotification";

const Sider = () => {
  //hooks
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { disconnectWallet } = useAutoConnect ();
  const { showNotification } = useNotification ();
  //atoms
  const [, setCurrentModalType] = useAtom(currentModalTypeAtom);
  const [xBalances] = useAtom(xBalancesAtom);
  const [curBalance, setCurBalance] = useAtom(curBalanceAtom);
  //handle navigate
  const handleNavigate = (url: string) => {
    router.push(url);
  }
  /**
   * render Link item
   * @param _name text to display for link
   * @param _icon icon for link
   * @param _url url to navigate
   * @param _urls url list for highlight
   * @returns React.ReactNode
   */
  const _renderLinkItem = (_name: string, _icon: string, _url: string, _urls: string[] = []) => (
    // <li onClick={() => handleNavigate(_url)} className={`border border-[#DCE4EF] flex items-center p-2 text-black dark:text-white gap-2 dark:border-black hover:border-[#F7F9FC] hover:bg-[#F7F9FC] my-1 dark:hover:bg-[#10152E] rounded-xl cursor-pointer text-sm ${ [_url, ..._urls].includes(pathname) && 'dark:bg-[#10152E] border-none bg-[#F7F9FC]' }`}>
    <li onClick={() => handleNavigate(_url)} className={`border border-[#DCE4EF] flex items-center p-2 text-black dark:text-white gap-2 dark:border-black hover:border-[#F7F9FC] hover:bg-[#F7F9FC] my-1 dark:hover:bg-[#10152E] rounded-xl cursor-pointer text-sm ${ (_urls.length === 0 && pathname.substring(0, _url.length) === _url || _urls.length > 0 && _urls.includes(pathname)) && 'dark:bg-[#10152E] border-none bg-[#F7F9FC]' }`}>
      <Image
        src={_icon}
        width={27}
        height={27}
        alt={"logo"}  
        priority={true}     
      />
      { _name }
    </li>
  )
  /**
   * goto wallet connect page
   */
  const handleToConnectPage = () => {
    setCurrentModalType("");
    router.push("/connect-wallet");
  }
  /**
   * disconnect current connected wallet
   */
  const handleDisconnect = async () => {
    disconnectWallet ();
  }
  /**
   * render current item
   * @returns React.ReactNode
   */
  const _renderCurrentItem = () => (
    <div className="cursor-pointer bg-[#F59E0B] px-4 py-1 flex rounded-full text-[12px]">{ TOKEN_DATA[String(curBalance?.balance[0]?.asset)] ? TOKEN_DATA[String(curBalance?.balance[0]?.asset)].ticker : "BTC" }</div>
  )
  /**
   * show tutorials...
   */
  const showTotorials = () => {
    showNotification ("Coming Soon!", "info");
  }

  return (
    <div className="dark:bg-gradient-to-tr dark:from-[#FF6A00] dark:via-[#10152E] dark:to-[#F81969] p-[1px] rounded-2xl flex-none md:w-[310px] w-full">
      <div className="bg-white flex flex-col justify-between dark:bg-black rounded-2xl p-6 w-full h-full md:min-h-[calc(100vh-130px)]">
        <div>
          <p className="text-[14px] text-[#111214] dark:text-[#8D98AF]">My Balance</p>
          <div className="flex justify-between text-black dark:text-white">
            <div className="text-lg my-1">{ curBalance ? String(curBalance?.balance[0].amount).substr(0, 10) : '0' }</div>
            <div>
            {
              Object.keys(xBalances).length > 0 ?
              <Dropdown label="" renderTrigger={_renderCurrentItem}>
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
                      /> {CHAIN_DATA[xBalances[key].chain as string].name}
                    </Dropdown.Item>
                  ))
                }
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleDisconnect}><Icon icon="tabler:logout" className="mr-2" width={26}/>Disconnect</Dropdown.Item>
              </Dropdown> :
              <div className="cursor-pointer bg-[#F59E0B] px-4 py-1 flex rounded-full text-[12px]">&nbsp;</div>
            }
            </div>
          </div>
          <p className="text-[14px] text-[#8D98AF]">$ { reduceAmount(Number(curBalance?.balance[0].amount) * Number(curBalance?.balance[0].value)) } USD</p>

          <ul className="text-white text-md mt-5">
            { _renderLinkItem("Swap", "/images/swap.svg", "/", ["/","/connect-wallet"]) }
            { _renderLinkItem("Liquidity", "/images/add-liquidity.svg", "/liquidity") }
            {/* { _renderLinkItem("Add Liquidity", "/images/add-liquidity.svg", "/liquidity/add") }
            { _renderLinkItem("Remove Liquidity", "/images/remove-liquidity.svg", "/liquidity/remove") } */}
            { _renderLinkItem("My Wallet", "/images/my-wallet.svg", "/my-wallet") }
            { _renderLinkItem("Savers", "/images/savers.svg", "/savers") }
          </ul>

          <div className="mt-6 border-[#DCE4EF] dark:border-[#1f2124] border w-full bg-[#F7F9FC] dark:bg-[#111214] rounded-3xl p-4 pt-5">
            <div className="text-black dark:text-white text-center text-md font-bold mb-3">Getting started?</div>
            <div className="text-black text-center dark:text-white text-sm pb-4 pt-1">Feel free to watch these<br/>tutorials</div>
            <button onClick={showTotorials} className="w-full flex justify-center items-center gap-2 text-white p-2 text-sm bg-gradient-to-r from-[#ff6702e7] to-[#EE0E72] rounded-xl hover:from-[#FF6802] hover:to-[#ee0e73b7]">
              {/* <Image
                src="/images/phone.svg"
                width={19}
                height={19}
                alt={"logo"}    
                priority={true}   
              /> */}
              <Icon icon="mdi:academic-cap" width="1.5rem" height="1.5rem" />
              Tutorials
            </button>
          </div>
          <div onClick={() => window.open("https://discord.gg/mayaprotocol", "_blank")} className="mt-5 hover:underline w-full cursor-pointer bg-[#131822] text-white dark:bg-[#111214] dark:border-[#f5efeb2f] border dark:text-white rounded-xl p-3 flex items-center justify-center gap-2">
            {/* <Image
              src="/images/group.svg"
              width={19}
              height={19}
              alt={"logo"}   
              priority={true}    
            /> */}
            <Icon icon="ic:sharp-discord" width="1.5rem" height="1.5rem" />
            Join Discord
          </div>
        </div>

        {/* <div className="flex justify-center gap-5 mt-5">
          {
            _socialLinks.map(({url, img}: {url: string, img: string}, index: number) => 
              <Image
                key={img}
                className="cursor-pointer hover:opacity-50"
                src={img}
                width={40}
                height={40} 
                alt={"logo"}      
                priority={true} 
              />
            )
          }
        </div> */}

        {/* <div className="flex items-center justify-between mt-4">
          <div className="flex items-center cursor-pointer hover:text-[#6f767ece] hover:underline text-[#6F767E] gap-3">
            <Image
              src="/images/help.svg"
              width={24}
              height={24}
              alt={"help"}   
              priority={true}    
            />
            Help & getting started
          </div>
          <div className="bg-[#7288FA] aspect-square w-6 rounded-md flex justify-center items-center text-sm text-white">8</div>
        </div> */}

        <div className="relative flex bg-[#F7F9FC] dark:bg-[#111214] rounded-xl w-full p-2 mt-4">
          <div className={`absolute left-2 dark:left-[calc(50%-8px)] rounded-xl h-[calc(100%-16px)] w-[50%] z-0 bg-gradient-to-r from-[#FF6802] to-[#EE0E72] transition-[left] duration-200`}>
          </div>
          <div onClick={() => setTheme("dark")} className={`flex z-10 justify-center cursor-pointer items-center gap-2 dark:text-[#6F767E] text-white text-sm p-2 w-1/2`}>
            <Image
              src={ theme !== "dark" ? "/images/sun.svg" : "/images/sun-bright.svg" }
              width={24}
              height={24}
              alt={"sun"}   
              priority={true}    
            />
            Light
          </div>
          <div onClick={() => setTheme("light")} className={`flex z-10 justify-center cursor-pointer items-center gap-2 text-[#6F767E] dark:text-white text-sm p-2 w-1/2`}>
            <Image
              src={ theme !== "dark" ? "/images/moon-bright.svg" : "/images/moon.svg" }
              width={24}
              height={24}
              alt={"sun"}    
              priority={true}   
            />
            Dark
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sider;
