import React from 'react';
import Image from "next/image";
import { Icon } from '@iconify/react';
import { Prosto_One } from 'next/font/google';

type PropsType = {
  visible: Boolean,
  setVisible: React.Dispatch<React.SetStateAction<Boolean>>
}

const TokenSelector = (props: PropsType) => {

  return (
    <div className={`absolute top-full mt-2 z-10 left-0 w-full ${!props.visible && 'hidden'}`}>
      <div
        className="fixed opacity-0 top-0 left-0 right-0 bottom-0"
        onClick={() => {
          props.setVisible(false);
        }}
      ></div>
      <div className="relative tokens overflow-y-auto bg-[#eee9e9] dark:bg-[#171A1F] h-[300px] rounded-md px-3 py-5 w-full !z-40">
        <div className="w-full border-b border-dashed border-white dark:border-[#ffffff25]"></div>
        {[1, 2, 3, 4, 5, 7, 8, 9].map((item: Number) =>
          <div key={item + ""} className="hover:dark:bg-[#12151a] hover:bg-[#ffffff81] px-2 cursor-pointer w-full flex gap-3 py-2 items-center border-b border-dashed border-white dark:border-[#ffffff25]">
            <Image
              src="/images/chains/btc.webp"
              width={30}
              height={30}
              alt={"sun"}
              priority={true}
            />
            BTC (Bitcoin chain)
          </div>
        )
        }
      </div>
    </div>
  )
}

export default TokenSelector;