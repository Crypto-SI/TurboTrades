"use client"
import React from 'react';
import Image from "next/image";
import { Icon } from '@iconify/react';
import { Dropdown } from 'flowbite-react';
import { useAtom } from "jotai";
import axios from 'axios';
//atoms
import {
  mainPoolsAtom,
  tokenPricesAtom,
  xBalancesAtom,
  walletAtom
} from '@/store';
//data
import { SUB_LINKS,TOKEN_DATA } from '@/utils/data';
//router
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
//types
import { IMemberPool, IPool } from '@/types/maya';
//methods
import { reduceAmount, _feeEstimation } from '@/utils/methods';
//hooks
import useXChain from "@/hooks/useXChain";
import useXDefi from "@/hooks/useXDefiWallet";
import useMetamask from "@/hooks/useMetamask";
import useNotification from '@/hooks/useNotification';

const AddLiquidity = () => {
  //router
  const router = useRouter();
  const searchParams = useSearchParams();
  const asset = searchParams.get("asset"); //liquidity/add/ETH.ETH
  const pathname = usePathname ();
  //set mode between single and double
  const [mode, setMode] = React.useState<string>("asym");
  const [selectedPool, setSelectedPool] = React.useState<IPool | undefined>();
  const [amount, setAmount] = React.useState<string>("");
  const [selectedTokenPrice, setSelectedTokenPrice] = React.useState<string>("0");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  //atoms
  const [pools, ] = useAtom(mainPoolsAtom);
  const [xBalances, ] = useAtom(xBalancesAtom);
  const [wallet,] = useAtom(walletAtom);
  //my member pools
  const [myPool, setMyPool] = React.useState<{ asym: IMemberPool|undefined, sym: IMemberPool|undefined }>({ asym: undefined, sym: undefined });
  // const [myPool, setMyPool] = React.useState<Record<string, IMemberPool|undefined>>({ asym: undefined, sym: undefined });
  //hooks
  const { xChainWithdrawLiquidity } = useXChain ();
  const { xDefiWithdrawLiquidity } = useXDefi ();
  const { showNotification } = useNotification ();

  /**
   * @when asset is change, set the selectedPool
   */
  React.useEffect(() => {
    const pool = pools.find((_pool: IPool) => _pool.asset === asset);
    setSelectedPool(pool);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, pools]);
  /**
   * available CACAO for asym
   */
  const runeAvailable = React.useMemo(() => {
    return myPool.sym ? Number(myPool.sym.runeAdded) - Number(myPool.sym.runeWithdrawn) : 0
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myPool, mode]);
  /**
   * available ASSET for asym
   */
  const assetAvailable: number = React.useMemo(() => {
    if (mode === "asym") {
      if ( myPool.asym ) {
        return myPool.asym.assetAdded - myPool.asym.assetWithdrawn;
      } else if (myPool.sym) {
        return ( myPool.sym.assetAdded - myPool.sym.assetWithdrawn ) + (myPool.sym.runeAdded - myPool.sym.runeWithdrawn)/100/Number(selectedPool?.assetPrice);
      }
    } else if (myPool.sym) {
      return myPool.sym.assetAdded - myPool.sym.assetWithdrawn;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myPool, mode]) as number;
  /**
   * when token amount to deposit is changed
   * @param e 
   * @returns 
   */
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    //@ts-ignore
    if (Number(value) < 0 || isNaN(Number(value)) || value.length > 15) {
      return;
    }
    setAmount(value);
  }
  /**
   * when token amount is changed, calculate it's value...
   */
  React.useEffect(() => {
    if ( selectedPool ) {
      const _price = Number(amount) * Number(selectedPool?.assetPriceUSD);
      setSelectedTokenPrice(reduceAmount(_price));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, selectedPool]);
  /**
   * fetch my asym&sym pools
   */
  const fetchMyPools = async(address: string) => {
    console.log(address)
    try {
      const { data } = await axios.get(`https://midgard.mayachain.info/v2/member/${address}`);
      const _symPool = data.pools.filter((_pool: IMemberPool) => _pool.pool === asset).find((_pool: IMemberPool) => Number(_pool.runeAdded) !== 0);
      const _asymPool = data.pools.filter((_pool: IMemberPool) => _pool.pool === asset).find((_pool: IMemberPool) => Number(_pool.runeAdded) === 0);
      console.log ({_symPool, _asymPool});
      setMyPool({ asym: _asymPool, sym: _symPool });
    } catch (err) {

    }
  }
  /**
   * set withdraw amount as percent of whole amount
   * @param percent 
   */
  const setPercentOfAll = (percent: number) => {
    const _amount = (isNaN(assetAvailable) ? 0 : assetAvailable) * percent;
    setAmount (String(_amount/10**8));
  }
  /**
   * when asset or balances are changed, call fetchPools method
   */
  React.useEffect(() => {
    try {
      if (!asset) throw "no asset";
      const address = xBalances[TOKEN_DATA[asset].chain]?.address;
      console.log(xBalances[TOKEN_DATA[asset].chain])
      if (!address) throw "no address";
      fetchMyPools (address);
    } catch (err) { }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, xBalances])
  /**
   * render pool selector
   * @returns React.ReactNode
   */
  const _renderPoolSelector = () => (
    <div className='flex gap-3 text-lg items-center'>
      <Image
        src={selectedPool ? String(selectedPool.image) : "/images/chains/btc.webp"}
        width={45}
        height={45}
        alt={"sun"}
        priority={true}   
        className='rounded-xl'   
      />
      { selectedPool?.ticker }
    </div>
  )
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
  );
  /**
   * withdraw the liquidity
   * @param bps 
   */
  const onWithdraw = async (bps: number) => {
    try {
      setIsLoading (true);
      const { data } = await axios.get(`https://mayanode.mayachain.info/mayachain/inbound_addresses`);
      const _inbountAddress = data.find((item: any) => item.chain === selectedPool?.chain);//inbound address
      if (!_inbountAddress) throw "None inbound address";
      const address = xBalances[selectedPool?.chain as string]?.address;
      const mayaAddress = xBalances['MAYA']?.address;

      if (!address) throw "Please connect current chain.";
      if (!mayaAddress) throw "Please connect Maya chain.";

      const nativeDecimal = TOKEN_DATA[selectedPool?.asset as string].decimals;

      if (wallet?.name === "Keystore") {
        const hash = await xChainWithdrawLiquidity ({
          asset: String(selectedPool?.asset),
          decimals: nativeDecimal,
          bps: String(bps),
          recipient: _inbountAddress.address,
          address: address,
          mayaAddress: mayaAddress,
          mode: mode
        });
        const target = (mode === "sym") ? `/progress/liquidity/remove?hash=${hash}&from=${mayaAddress}&in=${selectedPool?.asset}&out=MAYA.CACAO&ina=${amount}&outa=${ mode === "sym" ? Number(amount)*Number(selectedPool?.assetPrice) : '0' }&start=1709893536993`
                                      : `/progress/liquidity/remove?hash=${hash}&from=${address}&in=${selectedPool?.asset}&out=MAYA.CACAO&ina=${amount}&outa=${ mode === "sym" ? Number(amount)*Number(selectedPool?.assetPrice) : '0' }&start=1709893536993`;
        router.push(target);
      } else if (wallet?.name === "XDEFI") {
        const hash = await xDefiWithdrawLiquidity ({
          asset: String(selectedPool?.asset),
          decimals: nativeDecimal,
          bps: String(bps),
          recipient: _inbountAddress.address,
          address: address,
          mayaAddress: mayaAddress,
          mode: mode
        });
        const target = (mode === "sym") ? `/progress/liquidity/remove?hash=${hash}&from=${mayaAddress}&in=${selectedPool?.asset}&out=MAYA.CACAO&ina=${amount}&outa=${ mode === "sym" ? Number(amount)*Number(selectedPool?.assetPrice) : '0' }&start=1709893536993`
                                      : `/progress/liquidity/remove?hash=${hash}&from=${address}&in=${selectedPool?.asset}&out=MAYA.CACAO&ina=${amount}&outa=${ mode === "sym" ? Number(amount)*Number(selectedPool?.assetPrice) : '0' }&start=1709893536993`;
        router.push(target);
      } else if (wallet?.name === "Metamask") {
        // await doMetamaskSwap (fromAmount);
      }

    } catch (err) {
      if (String(err).includes("insufficient funds for intrinsic transaction cost")) {
        showNotification("Insufficient funds for intrinsic transaction cost.", "warning");
      } else {
        showNotification(String(err), "warning");
      }
    } finally {
      setIsLoading (false);
    }
  }
  /**
   * when use click the withdraw button
   */
  const handleWidthDrawLiquidity = () => {

    const LIMIT: Record<string, number> = {
      "THOR": 0.05,
      "KUJI": 0.02,
      "DASH": 0.00125,
      "BTC": 0.0001,
      "ETH": 0.0001
    }

    if (isLoading) return;

    try {
      
      console.log({amount: amount, availalbe: assetAvailable/10**8});
      if (Number(amount) > assetAvailable/10**8) throw "Insufficient withdraw amount.";
      if (Number(amount) < LIMIT[String(selectedPool?.chain)]) throw `Too small transaction detected.(>${LIMIT[String(selectedPool?.chain)]})`;
      
      console.log({amount: Number(amount)*Number(selectedPool?.assetPrice), cacao: runeAvailable/10**10});
      if (mode === "sym" && Number(amount)*Number(selectedPool?.assetPrice) > runeAvailable/10**10) throw "Insufficient CACAO amount.";
      
      console.log({amount: runeAvailable/10**10 - Number(amount)*Number(selectedPool?.assetPrice), cacao: 0.5});
      if (mode === "sym" && runeAvailable/10**10 - Number(amount)*Number(selectedPool?.assetPrice) < 0.5 ) throw "Insufficient CACAO fee (0.5CACAO).";

      const bps = Math.floor( 10000 * Number(amount) * 10**8 / assetAvailable );
      console.log(bps);

      onWithdraw (bps);
    } catch (err) {
      showNotification(String(err), "info");
    }
  }


  return (
    <div className="flex grow flex-col mt-2">
      <div className='flex gap-1'>
        {SUB_LINKS.map(({ label, url }: { label: string, url: string }) => _renderSubLink(label, url))}
      </div>
      <div className='flex flex-col w-full justify-center items-center  mt-2 lg:mt-20'>
        <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full lg:w-[750px]">
          <div className="rounded-2xl p-3 pt-4 bg-white dark:bg-[#0A0C0F] dark:text-white">
            <div className='flex lg:gap-0 text-md gap-2 lg:space-x-2 lg:flex-row flex-col dark:bg-black bg-[#F7FAFD] dark:border-none border-[#DCE4EF] border p-2 rounded-2xl'>
              <button onClick={() => setMode("asym")} className={`bg-[#0A0F14] text-sm p-3 w-full lg:w-1/2 hover:opacity-80 rounded-xl text-white ${mode === "asym" && 'bg-gradient-to-r from-[#FF6802] to-[#EE0E72]'}`}>SINGLE SIDE</button>
              <button onClick={() => setMode("sym")} className={`bg-[#0A0F14] text-sm p-3 w-full lg:w-1/2 hover:opacity-80 rounded-xl text-white ${mode === "sym" && 'bg-gradient-to-r from-[#FF6802] to-[#EE0E72]'}`}>DOUBLE SIDE</button>
            </div>

            <div className={`flex space-x-2 flex-col lg:flex-row`}>
              <div className="w-full p-4 dark:text-[#ffffffa1] dark:bg-[#030506] bg-[#F3F7FC] rounded-2xl mt-3 border border-[#DCE4EF] dark:border-none">
                <div className='flex justify-between items-center'>
                  <Dropdown label=""  renderTrigger={_renderPoolSelector} placement="right">
                    <Dropdown.Item>Liquidity Pools</Dropdown.Item>
                    <Dropdown.Divider />
                    {
                      pools.map((_pool: IPool) => 
                      <Dropdown.Item key={_pool.asset} onClick={() => router.push(`${pathname}?asset=${_pool.asset}`)} className='flex gap-2 !text-sm'>
                        <Image
                          src={ _pool.image as string }
                          width={25}
                          height={20}
                          alt={"sun"} 
                          priority={true}      
                          className='rounded-full'
                        />
                        <span>{_pool.ticker}</span>
                        <span>/</span>
                        <Image
                          src="/images/tokens/cacao.png"
                          width={25}
                          height={20} 
                          priority={true}
                          alt={"cacao"}      
                        />
                        <span>CACAO</span>
                      </Dropdown.Item>)
                    }
                  </Dropdown>
                  <button onClick={() => setPercentOfAll(0.5)} className='rounded-xl dark:bg-[#0A0F14] aspect-auto p-[14px] bg-white dark:border-[#D1DBE8] border text-sm border-none text-[#A6ADB9] hover:opacity-80'>50%</button>
                </div>
                <div className='flex flex-col text-sm xs:flex-row gap-2 mt-3 justify-between'>
                  <div className='flex flex-col xs:flex-row items-center justify-between dark:bg-[#0a0f14] grow bg-white border border-[#DCE4EF] dark:border-[#3341558e] rounded-xl p-[6px]'>
                    <div className='w-full xs:w-auto text-[#8A8D92] dark:text-[#B0B7C3] pl-3'>Amount:</div>
                    <input
                      placeholder="0.0"
                      onChange={handleAmountChange}
                      value={amount}
                      className="grow px-2 bg-transparent py-2 rounded-[12px] w-full outline-none border-none" 
                    />
                    <div className='px-2 w-full xs:w-auto'>{selectedTokenPrice}$</div>
                  </div>
                  <button onClick={() => setPercentOfAll(1)} className='rounded-xl dark:bg-[#0A0F14] aspect-auto p-3 bg-white dark:border-[#D1DBE8] border border-none text-[#A6ADB9] hover:opacity-80'>MAX</button>
                </div>
                <div className='text-sm text-[#6978A0] mt-2 px-2'>
                  <span>Available: </span>
                  <span className='dark:text-white text-black'>
                    { reduceAmount(assetAvailable/10**8) } { selectedPool?.ticker }
                  </span>
                </div>
              </div>

              {
                mode === "sym" &&
                <div className="w-full p-4 dark:text-[#ffffffa1] dark:bg-[#030506] bg-[#F3F7FC] rounded-2xl mt-3 border border-[#DCE4EF] dark:border-none">
                  <div className='flex justify-between items-center'>
                    <div className='flex gap-3 text-lg items-center'>
                      <Image
                        src="/images/tokens/cacao.png"
                        width={45}
                        height={45}
                        alt={"sun"}
                        priority={true}      
                      />
                      CACAO
                    </div>
                  </div>
                  <div className='flex flex-col text-sm xs:flex-row gap-2 mt-3 justify-between'>
                    <div className='flex flex-col xs:flex-row items-center justify-between dark:bg-[#0a0f14] grow bg-white border border-[#DCE4EF] dark:border-[#3341558e] rounded-xl p-[6px]'>
                      <div className='w-full xs:w-auto text-[#8A8D92] dark:text-[#B0B7C3] pl-3'>Amount:</div>
                      <input
                        disabled
                        value={Number(amount)*Number(selectedPool?.assetPrice)}
                        className="grow px-2 bg-transparent py-2 rounded-[12px] w-full outline-none border-none" 
                      />
                      <div className='px-2 w-full xs:w-auto'>{selectedTokenPrice}$</div>
                    </div>
                    <button className='rounded-xl dark:bg-[#0A0F14] aspect-auto p-3 bg-white dark:border-[#D1DBE8] w-14 border border-none text-[#A6ADB9] hover:opacity-80'></button>
                  </div>
                  <div className='text-sm text-[#6978A0] mt-2 px-2'>
                    <span>Available: </span>
                    <span className='dark:text-white text-black'>
                      { reduceAmount(runeAvailable/10**10) } CACAO
                    </span>
                  </div>
                </div>
              }
            </div>

            {/* <div className='mt-2 text-[#6978A0] px-2 text-[15px]'>
              <span className='font-bold'>Amount: </span>
              <span>1.00 BTC (42.12272850 ETH)</span>
            </div> */}

            <button onClick={handleWidthDrawLiquidity} className='text-white mt-4 rounded-xl bg-gradient-to-r from-[#FF6802] to-[#EE0E72] p-4 w-full cursor-pointer hover:opacity-50'>
              {
                !isLoading ? "Rmove Liquidity" :
                <div className="flex items-center gap-2 justify-center"><Icon icon="icomoon-free:spinner9" className="spin"/>Processing...</div>
              }
            </button>
              
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddLiquidity;