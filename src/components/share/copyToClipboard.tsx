"use client"
import React from 'react';
import { Icon } from '@iconify/react';
import { copyToClipboard } from '@/utils/methods';
import { setConfig } from 'next/config';
import { Tooltip } from 'flowbite-react';

const ClipboardCopier = ({text, size=22}: {text: string, size?: number}) => {
  /**
   * 500ms after copying, reDisplay copy icon
   */
  const [isCopied, setIsCopied] = React.useState<boolean>(false);
  const handleCopy = () => {
    try {
      copyToClipboard (text);
      setIsCopied (true);
      setTimeout (() => {
        setIsCopied (false);
      }, 500);
    } catch (err) {

    }
  }

 return (
    isCopied ?  
    <Icon icon="entypo:check" className={`text-[${size}px] cursor-pointer hover:opacity-75`}/> : 
    <Icon onClick={handleCopy} icon="akar-icons:copy" className={`text-[${size}px] cursor-pointer hover:opacity-75`}/>
  )
}

export default ClipboardCopier;