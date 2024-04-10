"use client"
import React from 'react';
import axios from "axios";
import Image from "next/image";
import { Icon } from '@iconify/react/dist/iconify.js';
import { useTheme } from "next-themes";

const Savers = () => {
  //hooks
  const { theme } = useTheme();
  
  return (
    <div className="flex-grow flex justify-center items-center sm:pl-0 md:pl-3">
      <div className="rounded-2xl p-[1px] bg-gradient-to-tr from-[#ff6a0096] via-[#6d78b280] to-[#e02d6f86] mt-10 md:mt-0 w-full lg:w-[500px]">
        <div className="rounded-2xl flex p-4 bg-white dark:bg-[#0A0C0F] dark:text-white text-black text-center">
          <Image
            src={ theme === "dark" ?  '/images/logo-light.png' : "/images/logo-dark.svg" }
            width={100}
            height={20} 
            alt={"logo"}  
            priority={true}     
          />
          <div className='grow flex justify-center items-center'>Coming Soon</div>
        </div>
      </div>
    </div>
  )
}

export default Savers;