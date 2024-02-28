"use client"

import React from "react";
import { useAtom } from "jotai";
import { ethers } from 'ethers';
import axios from 'axios';
import { ETHERSCAN_API_KEY } from "@/config";
import { injected } from "@/utils/connectors";
import { useWeb3React } from "@web3-react/core";
import { useRouter } from 'next/navigation';
import useNotification from "@/hooks/useNotification";
//atoms
import {
  isConnectingAtom,
  chainListAtom,
  xBalancesAtom,
  xDefiAddressesAtom,
  isWalletDetectedAtom,
  fromTokenAtom,
  toTokenAtom,
  QuoteSwapResponseAtom,
  showTrxModalAtom,
  trxUrlAtom
} from "@/store";
//types
import { ChainType, IBalance, IWallet } from "@/types/minis";
import { IQuoteSwapResponse } from "@/types/maya";
//data
import { NATIVE_TOKENS, ERC20_DECIMALS } from "@/utils/data";
//context type
interface IMetamaskContext {
  connectToMetamask: () => Promise<any>,
  getBalanceWithMetamask: () => Promise<void>
  doMetamaskSwap: (amount: string | number) => Promise<void>
}
//data
import { ERC_20_ADDRESSES } from "@/utils/data";
//abis
import ERC20 from "@/utils/ABIs/erc20.json";
//third parties
import { _getPrices } from "./XChainContext";
//methods to send ETH, and ERC20 tokens
import { _sendEther, _depositERC20Token } from "./XDefiContext"; //send ERC20 tokens
/**
 * MetamaskContext
*/
export const MetamaskContext = React.createContext<IMetamaskContext | undefined>(undefined);

const XChainProvider = ({ children }: { children: React.ReactNode }) => {
  //hooks
  const router = useRouter ();
  const { showNotification } = useNotification ();
  const { account, library, chainId, activate, deactivate } = useWeb3React();
  //atoms
  const [xBalances, setXBalances] = useAtom(xBalancesAtom);
  const [chainList, setChainList] = useAtom(chainListAtom);
  const [, setIsConnecting] = useAtom(isConnectingAtom);
  const [, setXDefiAddresses] = useAtom(xDefiAddressesAtom);
  const [, setIsWalletDetected] = useAtom(isWalletDetectedAtom);
  const [quoteSwap,] = useAtom(QuoteSwapResponseAtom);
  const [toToken,] = useAtom(toTokenAtom);
  const [fromToken,] = useAtom(fromTokenAtom);
  const [showTrxModal, setShowTrxModal] = useAtom(showTrxModalAtom);//show trx modal
  const [trxUrl, setTrxUrl] = useAtom(trxUrlAtom);
  //chains that is selected at this moment
  const chains = chainList.filter((_chain: ChainType) => _chain.selected).map((_chain: ChainType) => _chain.label);
  /**
   * get wallet balances including ETH, USDT, USDC, WSTETH...
   * @returns 
   */
  const getBalanceWithMetamask = async () => {
    if (!account) {
      return;
    } 
    try {
      setIsConnecting (true);
      setXBalances ({});
      if (chainId !== 1) {
        await _switchToMainnet ();
      }

      const prices = await _getPrices();
      console.log("@dew1204/fetching start chain balances----------------->");
      //@ts-ignore
      const balances: IBalance[] = await Promise.all(Object.keys(ERC_20_ADDRESSES).map(async(asset: string) => {
        try {
          if (asset === "ETH") {
            const _eth = await library.getSigner().provider.getBalance(account);
            return {
              address: account,
              chain: "ETH", 
              value: prices["ETH.ETH"], 
              asset: "ETH.ETH",
              amount: String(ethers.utils.formatEther(_eth))
            }
          } else {
            const contract = new ethers.Contract(ERC_20_ADDRESSES[asset], ERC20, library.getSigner());
            const balance = await contract.balanceOf(account);
            const _asset = "ETH" + "." + asset;
            return {
              address: account,
              symbol: asset, 
              chain: "ETH", 
              asset: _asset,
              value: prices[_asset],
              amount: String(Number(balance)/10**ERC20_DECIMALS[asset]) //decimals USDT, USDC: 6, WSTETH: 18
            }
          }
        } catch (err) {
          console.log(err)
          return {
            account,
            asset: "ETH.ETH", 
            value: prices["ETH.ETH"],
            amount: "0"
          }
        }
      }));
      const eth: IWallet = {
        address: account as string,
        balance: balances,
        walletType: "METAMASK",
        chain: "ETH",
      }
      setXBalances({"ETH": eth});
      console.log("@dew1204/metamask balances -------------->", eth);
    } catch (err) {
      console.log(err)
    } finally {
      setIsConnecting(false);
    }
  }
  /**
   * if account is connected, call getBalanceWithMetamask
   */
  React.useEffect(() => {
    if (account) {
      getBalanceWithMetamask ();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);
  /**
   * if current Net is not MainNet, swith to main net.
   * @returns 
   */
  const _switchToMainnet = () => new Promise(async(resolve, reject) => {
    //@ts-ignore
    if (window.ethereum) {
      try {
        //@ts-ignore
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1' }],
        })
        resolve("");
      } catch (error) {
        console.error(error);
        reject("");
      }
    }
  });
  /**
   * show transaction Modal
   * @param _url 
   */
  const _showTxModal = (_url: string) => {
    setTrxUrl(_url);
    setShowTrxModal(true);
  }
  /**
   * Do swap using metamask
   * @param amount token amount to swap ...ETH, USDT, USDC, WSTETH
   */
  const doMetamaskSwap = async (amount: number | string) => {
    try {
      const { data } = await axios.get(`https://mayanode.mayachain.info/mayachain/inbound_addresses`);
      const _inbountAddress = data.find((item: any) => item.chain === "ETH");
      if (!_inbountAddress) throw "Inbound address is none.";
      if (_inbountAddress.address !== quoteSwap?.inbound_address) throw "Invalid Inbound Address";

      const signer = library.getSigner();

      if (fromToken?.ticker === "ETH") {
        const data = await _sendEther (amount as number, xBalances["ETH"].address, quoteSwap as IQuoteSwapResponse, signer);
        console.log("@ETH metamask transaction ----------------------------->", data);
        _showTxModal (`https://etherscan.io/tx/${data.hash}`);
      } else {
        const data = await _depositERC20Token (amount as number, xBalances["ETH"].address, quoteSwap as IQuoteSwapResponse, signer, String(fromToken?.ticker));
        console.log("@ETH metamask transaction ----------------------------->", data);
        _showTxModal (`https://etherscan.io/tx/${data.hash}`);
      }
    } catch (err) {
      console.log(err)
      showNotification(String(err), "warning");
    }
  }
  /**
   * Metamask wallet connect
   * @returns 
   */
  const connectToMetamask = () => new Promise(async(resolve, reject) => {
    try {
      setIsWalletDetected (false);
      await activate(injected, async (error) => {
        console.log(error.message);
        reject ("Cancel the operation...");
      });
      window.localStorage.setItem("lastWallet", "Metamask");
      setIsWalletDetected (true);
      resolve("");
    } catch (err) {
      showNotification(String(err), "wanrning");
      return reject();
    }
  });

  return (
    <MetamaskContext.Provider value={{ connectToMetamask, getBalanceWithMetamask, doMetamaskSwap }}>
      {children}
    </MetamaskContext.Provider>
  )
}

export default XChainProvider;

