"use client"
//@ts-ignore
// const rskUtils = require("@rsksmart/rsk-utils");
import { ChainType, WalletType } from "@/types/minis";
import BigNumber from 'bignumber.js';

/**
 * test if the suggested chain is supported chain of wallet
 * @param _wallet WalletType
 * @param _chain ChainType
 */
export const isSupportedChain = (_wallet: WalletType | null, _chain: ChainType) => {
  if (!_wallet) {
    return false;
  }
  const chain = _wallet.supportedChains?.find((item: string) => item === _chain.label);
  if (chain) {
    return true;
  } else {
    return false;
  }
}
/**
 * reduce balance
 * @if not number, return "0";
 * @if > 10e+7 10M
 * @if > 10e+4 10K
 * @if 0.001234 0.0012
 * @if 1.000000 1
 * 
 * @param number 12.0000123451
 * @returns string
 * 
 */
export const reduceAmount = (number: number | BigNumber | string | unknown) => {
  try {
    if (isNaN(number as number)) throw "0"; 
    const num = Math.floor(number as number);
    if (num >= 10**7) throw (num / 10**6).toFixed(2) + "M";
    if (num >= 10**4) throw (num / 10**3).toFixed(2) + "K";
    const decimal = (number as number - num).toString();
    let count = 0;
    for (let i = 2; i < decimal.length; i++) {
      if (decimal[i] == '0') {
        count ++;
      } else {
        break;
      }
    }
    throw num + decimal.substr(1, count + 3);
  } catch (value: any) {
    return value as string;
  }
}
/**
 * copy text to clipboard
 * @param text 
 */
export const copyToClipboard = async ( text: string ) => {
  // Navigator clipboard api needs a secure context (https)
  if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      // message.info(`Copied ${text}`)
  } else {
    // Use the 'out of viewport hidden text area' trick
    const textArea = document.createElement("textarea");
    textArea.value = text;
        
    // Move textarea out of the viewport so it's not visible
    textArea.style.position = "absolute";
    textArea.style.left = "-999999px";
        
    document.body.prepend(textArea);
    textArea.select();

    try {
        document.execCommand('copy');
        // message.info(`Copied ${text}`)
    } catch (error) {
        console.error(error);
    } finally {
        textArea.remove();
    }
  }
}
/**
 * check if XDefi wallet is installed
 * @returns Boolean
 */
export const isXDefiInstalled = () => {
  //@ts-ignore
  if (typeof window !== undefined && window.xfi) {
    return true;
  }
  return false;
}
/**
 * check if XDefi wallet is installed
 * @returns Boolean
 */
export const isMetamaskInstalled = () => {
  //@ts-ignore
  if (typeof window !== undefined && window.ethereum) {
    // Check if xdefi wallet is installed
    //@ts-ignore
    if (window.ethereum.isMetaMask) {
      return true;
    }
  }
  return false;
}
/**
 * read data from file
 * @param file 
 * @returns 
 */
export const readDataFromFile = (file: File) => new Promise((resolve, reject) => {
  const reader = new window.FileReader();
  reader.readAsText(file);
  reader.onloadend = async () => {
    try {
      const _json = JSON.parse(reader.result as string);
      resolve (_json);
    } catch (err) {
      console.log("@dew1204/invalid keystore file ---------->");
      reject ("Invalid keystore file, Please use another file");
    }
  }
});
/**
 * reduce address to shorter
 * @param address "0x29f95970cd0dd72cd7d6163b78693fe845daf796"
 * @returns "0x2...796"
 */
export const reduceAddress = (address: String = "0x29f95970cd0dd72cd7d6163b78693fe845daf796") => {
  return address.substring(0, 4) + "..." + address.substr(address.length - 4, 4);
}
/**
 * delay for given time
 * @param ms miliseconds
 * @returns Promise<void>
 */
export const sleep = (ms: number) => new Promise<void>((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, ms*1000)
});
/**
 * splite asset
 * @param _asset 
 * @returns 
 */
export const splitToAsset = (_asset: string) => {
  const asset = _asset.split("-")[0];
  const [, token] = asset.split(".");
  return { asset, token };
}

export const Address = (address: string) => {
  // return rskUtils.toChecksumAddress(address, 0x1);
  return ""
}