"use client"
//@ts-ignore
// const rskUtils = require("@rsksmart/rsk-utils");
import { ChainType, WalletType, TxResult, IChainData } from "@/types";
import BigNumber from 'bignumber.js';
import { FEE_ESTIMATIONS, FEE_URLS } from "./data";
import axios from 'axios';

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
export const reduceAmount = (number: number | BigNumber | string | unknown, len = 2) => {
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
    // count = 0;
    const _deciaml = Number(decimal).toFixed(count + len);
    throw num + _deciaml.substring(1, _deciaml.length);
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
 * @returns boolean
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
 * @param length length to cut from start and end
 * @returns "0x2...796"
 */
export const reduceAddress = (address: string = "0x29f95970cd0dd72cd7d6163b78693fe845daf796", length: number = 4) => {
  return address.substring(0, length) + "..." + address.substr(address.length - length, length);
}
/**
 * delay for given time
 * @param ms miliseconds
 * @returns Promise<void>
 */
export const sleep = (ms: number) => new Promise<void>((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, ms);
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
/**
 * get transaction fee estimation
 * @param _chain 
 * @returns 
 */
export const _feeEstimation = async (_chain: string) => {
  try {
    if (_chain === "MAYA" || _chain === "DASH" || _chain === "BTC") throw _chain;
    const { data } = await axios.get(FEE_URLS[_chain].url);
    const outbound: number = data.fees.outbound;
    return outbound / 10**FEE_URLS[_chain].decimals;
  } catch (err) {
    return FEE_ESTIMATIONS[_chain];
  }
}
/**
 * reduce hash for beautify...
 * @param hash 
 * @returns 
 */
export const _reduceHash = (hash: string = "") => {
  if (hash === "") {
    return hash;
  } else {
    return hash.substr(0, 30) + "......" + hash.substring(hash.length-12, hash.length-1)
  }
}
export const _renderLocaleDateTimeString = (timestamp: Date | string | number | undefined) => {
  timestamp = timestamp??0;
  const date = new Date(timestamp);
  const DATE = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const _day = date.getDay();
  const _date = date.toLocaleDateString();
  let _hour = date.getHours ();
  const _ampm = _hour < 12 ? "AM" : "PM";
  _hour = _hour > 12 ? _hour - 12 : _hour;
  let _min: string | number = date.getMinutes ();
  _min = _min < 10 ? "0" + _min : _min;
  return `${DATE[_day]} ${_date} ${_hour}:${_min} ${_ampm}`;
}

export const CHAINS: Record<string, IChainData> = {
  "MAYA": {
    label: "MAYA",
    name: "Maya chain",
    image: "/images/chains/maya.png",
    explorer: "https://www.mayascan.org",
    txExplorer: "https://mayanode.mayachain.info/cosmos/tx/v1beta1/txs/",
    getTransaction: async (hash: string) => {
      try {
        const { data } = await axios.get(`https://mayanode.mayachain.info/cosmos/tx/v1beta1/txs/${hash}`);
        if (!data.tx_response || !data.tx) throw "";
        const _data: TxResult = {
          hash: hash,
          url: 'https://www.mayascan.org/tx/' + hash,
          blockHeight: data.tx_response.height, 
          confirmed: true,
          blocktime: data.tx_response.timestamp,
          gas: data.tx_response.gas_used/1e10,
          fee: data.tx.auth_info.fee.amount[0] ? data.tx.auth_info.fee.amount[0].amount / 1e10 : 0.5
        }
        return Promise.resolve(_data)
      } catch (err) {
        return Promise.reject(undefined)
      }
    }
  },
  "BTC": {
    label: "BTC",
    name: "Bitcoin",
    image: "/images/chains/btc.webp",
    explorer: "https://btcscan.org",
    txExplorer: "https://btcscan.org/api/tx/",
    getTransaction: async (hash: string) => {
      try {
        const { data } = await axios.get(`https://btcscan.org/api/tx/${hash}`);
        const _data: TxResult = {
          hash: hash,
          url: 'https://btcscan.org/tx/' + hash,
          blockHeight: data.status.block_height, 
          confirmed: data.status.confirmed,
          confirmations: data.status.confirmed ? 1 : undefined,
          blocktime: Number(data.status.block_time)*1000,
          gas: data.fee/1e8,
          fee: data.fee/1e8
        }
        return Promise.resolve(_data)
      } catch (err) {
        return Promise.reject(undefined)
      }
    }
  },
  "ETH": {
    label: "ETH",
    name: "Ethereum",
    image: "/images/chains/eth.webp",
    explorer: "https://etherscan.io",
    txExplorer: "https://",
    getTransaction: async (hash: string) => {
      try {
        const API_KEY = "QJ4UTD1RDZ64DP9G5NMVTCU88H8VYYQQJX";
        const { data: { result: tx } } = await axios.get(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${API_KEY}`)
        if (typeof tx !== 'object' || Object.keys(tx).length == 0) throw "";
        const { data: { result: block } } = await axios.get(`https://api.etherscan.io/api?module=block&action=getblockreward&blockno=${Number(tx.blockNumber)}&apikey=${API_KEY}`)
        if (typeof block !== 'object' || Object.keys(block).length == 0) throw "";
        const _data: TxResult = {
          hash: hash,
          url: 'https://etherscan.io/tx/' + hash,
          blockHeight: Number(tx.blockNumber), 
          confirmed: true,
          blocktime: Number(block.timeStamp)*1000,
          gas: 0,
          fee: Number(tx.gas)*Number(tx.gasPrice)/1e18
        }
        return Promise.resolve(_data);
      } catch (err) {
        return Promise.reject("");
      }
    }
  },
  "KUJI": {
    label: "KUJI",
    name: "Kuji chain",
    image: "/images/chains/kuji.png",
    explorer: "https://finder.kujira.network/kaiyo-1",
    txExplorer: "https://as-proxy.gateway.atomscan.com/kujira-lcd/cosmos/tx/v1beta1/txs/",
    getTransaction: async (hash: string) => {
      try {
        const params0 = {
          "jsonrpc": "2.0",
          "id": 393561932178,
          "method": "tx_search",
          "params": {
            "query": `tx.hash='${hash}'`,
            "page": "1"
          }
        }
        const { data: { result: { txs } } } = await axios.post(`https://rpc.cosmos.directory/kujira/`, params0);
        const [tx] = txs;
        if (!tx) throw "no transaction";
        const gasFee = tx.tx_result.events.find((item: any) => (item.type === "tx" && item.attributes[0].key ==="fee" ));
        const fee = gasFee.attributes[0].value;
  
        const params1 = {"jsonrpc":"2.0","id":671126425115,"method":"block","params":{"height": tx.height}}
        const { data: { result } } = await axios.post(`https://rpc.cosmos.directory/kujira/`, params1);
  
        const txResult: TxResult = {
          hash: hash,
          url: 'https://finder.kujira.network/kaiyo-1/tx/' + hash,
          blockHeight: tx.height, 
          confirmed: true,
          blocktime: result.block.header.time,
          gas: tx.tx_result.gas_used,
          fee: Number(fee.substring(0, fee.length - 5)/1e6) //3000ukuji -> 3000kuji
        }
        return Promise.resolve(txResult);
      } catch (err) {
        console.log(err)
        return Promise.reject(undefined);
      }
    }
  },
  "DASH": {
    label: "DASH",
    name: "Dash chain",
    image: "/images/chains/dash.png",
    explorer: "https://explorer.dash.org/insight",
    txExplorer: "https://insight.dash.org/insight-api/tx/",
    getTransaction: async (hash: string) => {
      try {
        const { data } = await axios.get(`https://insight.dash.org/insight-api/tx/${hash}`);
        const _data: TxResult = {
          hash: hash,
          url: 'https://explorer.dash.org/insight/tx/' + hash,
          blockHeight: data.blockheight, 
          confirmed: data.confirmations > 0 ? true : false,
          confirmations: data.confirmations,
          blocktime: Number(data.time)*1000,
          gas: data.fees,
          fee: data.fees
        }
        return Promise.resolve(_data)
      } catch (err) {
        return Promise.reject(undefined)
      }
    }
  },
  "THOR": {
    label: "THOR",
    name: "Thorchain",
    image: "/images/chains/thor.webp",
    explorer: "https://runescan.io",
    txExplorer: "https://thorchain-thornode-lb-1.thorwallet.org/cosmos/tx/v1beta1/txs/",
    getTransaction: async (hash: string) => {
      try {
        const { data } = await axios.get(`https://thorchain-thornode-lb-1.thorwallet.org/cosmos/tx/v1beta1/txs/${hash}`);
        if (!data.tx_response || !data.tx) throw "";
        const _data: TxResult = {
          hash: hash,
          url: 'https://runescan.io/tx/' + hash,
          blockHeight: data.tx_response.height, 
          confirmed: true,
          blocktime: data.tx_response.timestamp,
          gas: data.tx_response.gas_used/1e8,
          fee: data.tx.auth_info.fee.amount[0] ? data.tx.auth_info.fee.amount[0].amount / 1e8 : 0.02
        }
        return Promise.resolve(_data)
      } catch (err) {
        return Promise.reject(undefined)
      }
    }
  },
}
/**
 * estimate inbound transaction time
 */
export const inboundConfirmTimeEstimation = (chain: string) => {
  const TIME_ESTIMATION: Record<string, number> = {
    "MAYA": 30,
    "ETH": 2*60,
    "THOR": 60,
    "KUJI": 30,
    "BTC": 30*60,
    "DASH": 10*60,
  }
  return TIME_ESTIMATION[chain];
}
/**
 * estimate outbound transaction time
 */
export const outboundConfirmTimeEstimation = (chain: string) => {
  const TIME_ESTIMATION: Record<string, number> = {
    "MAYA": 0.5*60,
    "ETH": 3*60,
    "THOR": 2*60,
    "KUJI": 60*2.5,
    "BTC": 30*60,
    "DASH": 10*60,
  }
  return TIME_ESTIMATION[chain];
}
/**
 * render remain time
 * @param seconds 
 * @returns 
 */
export const _renderEstimationTime = (seconds: number) => {
  let result: number | string = 0;
  if (seconds % 60 === 0 ) {
    result = seconds / 60;
  } else {
    result = (seconds / 60).toFixed (1);
  }
  return result;
}
