"use client"
import React from "react";
import { useAtom } from "jotai";

//xchain utils
import { baseToAsset } from "@xchainjs/xchain-util";
import { Balance, Network, XChainClient } from "@xchainjs/xchain-client";
//This can be used for any xchain client
import { Client as BTCClient, defaultBTCParams } from "@xchainjs/xchain-bitcoin";
import { Client as ETHClient, defaultETHParams } from "@/xchains/ethereum";
import { Client as MayaClient } from '@xchainjs/xchain-mayachain';
import { Client as DashClient, defaultDashParams } from '@xchainjs/xchain-dash';
import { Client as KujiraClient, defaultKujiParams } from '@xchainjs/xchain-kujira';
import { Client as THORClient } from "@xchainjs/xchain-thorchain";
import { MayachainAMM } from '@xchainjs/xchain-mayachain-amm'
import { MayaChain, MayachainQuery, QuoteSwap, QuoteSwapParams } from '@xchainjs/xchain-mayachain-query';
import { CryptoAmount, assetAmount, assetFromString, assetToBase, assetToString, Address, Asset, Chain } from '@xchainjs/xchain-util';
import { Wallet } from '@xchainjs/xchain-wallet'
import axios from "axios";
// import { Client as BNBClient } from "@xchainjs/xchain-binance";
// import { Client as CosmosClient } from "@xchainjs/xchain-cosmos";
// import { Client as DogeClient, defaultDogeParams } from '@xchainjs/xchain-doge';
// import { Client as BCHClient, defaultBchParams } from '@xchainjs/xchain-bitcoincash';
// import { Client as LTCClient, defaultLtcParams } from '@xchainjs/xchain-litecoin';
// import { Client as BSCClient, defaultBscParams } from '@xchainjs/xchain-bsc';
// import { Client as AvaxClient, defaultAvaxParams } from "@xchainjs/xchain-avax";
//atom from store
import {
  xClientsAtom,
  isConnectingAtom,
  chainListAtom,
  xBalancesAtom,
  isWalletDetectedAtom,
  fromTokenAtom,
  toTokenAtom,
  QuoteSwapResponseAtom
} from "@/store";
//public utils
import useNotification from "@/hooks/useNotification";
//types
import { ChainType, XClients, XBalances, IBalance, IWallet } from "@/types/minis";
import { NATIVE_TOKENS } from "@/utils/data";

interface IXChainContext {
  connectKeyStoreWallet: (phrase: string) => Promise<void>,
  getBalances: () => Promise<void>,
  doMayaSwap: (amount: string | number) => Promise<void>
}

/**
 * XChainContext
*/
export const XChainContext = React.createContext<IXChainContext | undefined>(undefined);

/**
   * get coin prices
   * @ prices {DASH: 2345}
   */
export const _getPrices = async () => {

  const { data } = await axios.get("https://mayanode.mayachain.info/mayachain/pools");

  const prices: Record<string, number> = {};

  const cacaoInfo = data.find((item: any) => item.asset === "ETH.USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48");
  const value = cacaoInfo.balance_asset / cacaoInfo.balance_cacao;
  prices.CACAO = value * 100;
  prices.USDC = 1;

  data.forEach((item: any) => {
    switch (item.asset) {
      case "ETH.ETH":
        prices.ETH = item.balance_cacao / item.balance_asset * value;
        break;
      case "BTC.BTC":
        prices.BTC = item.balance_cacao / item.balance_asset * value;
        break;
      case "KUJI.KUJI":
        prices.KUJI = item.balance_cacao / item.balance_asset * value;
        break;
      case "THOR.RUNE":
        prices.RUNE = item.balance_cacao / item.balance_asset * value;
        break;
      case "DASH.DASH":
        prices.DASH = item.balance_cacao / item.balance_asset * value;
        break;
      case "KUJI.USK":
        prices.USK = item.balance_cacao / item.balance_asset * value;
        break;
      case "ETH.USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7":
        prices.USDT = item.balance_cacao / item.balance_asset * value;
        break;
      case "ETH.WSTETH-0X7F39C581F595B53C5CB19BD0B3F8DA6C935E2CA0":
        prices.WSTETH = item.balance_cacao / item.balance_asset * value;
        break;
    }
  });
  return prices;
}

const XChainProvider = ({ children }: { children: React.ReactNode }) => {
  //atoms
  const [xClients, setXClients] = useAtom(xClientsAtom);
  const [xBalances, setXBalances] = useAtom(xBalancesAtom);
  const [chainList, setChainList] = useAtom(chainListAtom);
  const [, setIsConnecting] = useAtom(isConnectingAtom);
  const [, setIsWalletDetected] = useAtom(isWalletDetectedAtom);
  const [fromToken] = useAtom(fromTokenAtom);
  const [toToken] = useAtom(toTokenAtom);
  const [quoteSwapResponse] = useAtom(QuoteSwapResponseAtom);
  const [wallet, setWallet] = React.useState<Wallet|undefined>(undefined);

  const {showNotification} = useNotification ();

  //chains that is selected at this moment
  const chains = chainList.filter((_chain: ChainType) => _chain.selected).map((_chain: ChainType) => _chain.label);
  /**
   * connect to selected chains using keystore phrase
   * @param phrase 
  */
  const connectKeyStoreWallet = async (phrase: string) => {
    setIsWalletDetected(false);
    const settings = { network: Network.Mainnet, phrase }
    // UXTXO Clients
    const btcClient = new BTCClient({ ...defaultBTCParams, network: settings.network, phrase: settings.phrase }) // Bitcoin  
    // Cosmos based clients
    const mayaClient = new MayaClient(settings) // Maya
    // EVM Clients
    const ethClient = new ETHClient({ ...defaultETHParams, network: settings.network, phrase: settings.phrase }) // Ethereum
    //dash &
    const dashClient = new DashClient({ ...defaultDashParams, network: settings.network, phrase: settings.phrase });
    const kujiClient = new KujiraClient({ ...defaultKujiParams, network: settings.network, phrase: settings.phrase });
    const thorClient = new THORClient(settings);
    //clients
    const clients: XChainClient[] = [btcClient, mayaClient, ethClient, dashClient, kujiClient, thorClient];
    //wallet
    const _wallet: Wallet = new Wallet({
      BTC: new BTCClient({ ...defaultBTCParams, network: settings.network, phrase: settings.phrase }),
      ETH: new ETHClient({ ...defaultETHParams, network: settings.network, phrase: settings.phrase }), // Ethereum
      DASH: new DashClient({ ...defaultDashParams, network: settings.network, phrase: settings.phrase }),
      KUJI: new KujiraClient({ ...defaultKujiParams, network: settings.network, phrase: settings.phrase }),
      THOR: new THORClient(settings),
      MAYA: new MayaClient(settings),
    });

    console.log(_wallet);
    setWallet(_wallet);

    const _clients: XClients = {};
    clients.forEach((_client: XChainClient) => {
      //@ts-ignore
      if (chains.indexOf(_client.chain) !== -1) {
        //@ts-ignore
        _clients[_client.chain] = _client;
      }
    });
    setIsWalletDetected(true);
    setXClients(_clients);
    getBalances(_clients)
  }
  /**
   * 
   */
  const getBalances = async (_xClients: XClients = xClients) => {
    setXBalances({});
    const prices = await _getPrices();
    try {
      setIsConnecting(true);
      const _xBalances: XBalances = {};
      const balances = await Promise.all(chains.map(async (chain: string) => {
        _xBalances[chain] = await _getWalletBalance(_xClients[chain as string], prices);
        setXBalances({ ..._xBalances, [chain]: _xBalances[chain] });
        return chain;
      }));
      console.log("balances ------------------>", balances);
    } catch (err) {

    } finally {
      setIsConnecting(false);
    }
  }
  // XChainClient is the superclass to all client implementations.
  const _getWalletBalance = async (client: XChainClient, prices: Record<string, number>) => {
    try {
      //@ts-ignore
      let address = client.getAddress()
      //@ts-ignore
      const chain: string = client.chain;

      if (client.validateAddress(address) === false) {
        console.log(`Address: ${address} is invalid`);
        //@ts-ignore
        return null;
      }

      //@ts-ignore
      const balances: Balance[] = await client.getBalance(address).catch(err => { });
      console.log(chain + "------------------->", balances)

      //@ts-ignore
      const _balances: IBalance[] = (balances === undefined || balances.length === 0) ?
        [{
          address,
          //@ts-ignore
          symbol: NATIVE_TOKENS[chain], chain: chain, ticker: NATIVE_TOKENS[chain], value: prices[NATIVE_TOKENS[chain]],
          amount: 0,
        }] :
        balances.map((item: any) => ({
          address,
          symbol: item.asset.symbol,
          chain: item.asset.chain,
          ticker: item.asset.ticker,
          value: prices[item.asset.ticker],
          amount: baseToAsset(item.amount).amount(),
        }));

      const wallet: any = {
        address,
        balance: _balances,
        walletType: "Keystore",
        //@ts-ignore
        chain: client.chain,
      }
      //@ts-ignore
      return wallet;
    } catch (err) {
      console.log(err)
    }
  }
  //print quote swap
  const printQuoteSwap = (quoteSwap: QuoteSwap) => {
    console.log({
      toAddress: quoteSwap.toAddress,
      memo: quoteSwap.memo,
      expectedAmount: {
        asset: assetToString(quoteSwap.expectedAmount.asset),
        amount: quoteSwap.expectedAmount.baseAmount.amount().toString(),
        decimals: quoteSwap.expectedAmount.baseAmount.decimal,
      },
      dustThreshold: {
        asset: assetToString(quoteSwap.dustThreshold.asset),
        amount: quoteSwap.dustThreshold.baseAmount.amount().toString(),
        decimals: quoteSwap.dustThreshold.baseAmount.decimal,
      },
      totalFees: {
        asset: assetToString(quoteSwap.fees.asset),
        affiliateFee: {
          asset: assetToString(quoteSwap.fees.affiliateFee.asset),
          amount: quoteSwap.fees.affiliateFee.baseAmount.amount().toString(),
          decimals: quoteSwap.fees.affiliateFee.baseAmount.decimal,
        },
        outboundFee: {
          asset: assetToString(quoteSwap.fees.outboundFee.asset),
          amount: quoteSwap.fees.outboundFee.baseAmount.amount().toString(),
          decimals: quoteSwap.fees.outboundFee.baseAmount.decimal,
        },
      },
      inboundConfirmationSeconds: quoteSwap.inboundConfirmationSeconds,
      inboundConfirmationBlocks: quoteSwap.inboundConfirmationBlocks,
      outboundDelaySeconds: quoteSwap.outboundDelaySeconds,
      outboundDelayBlocks: quoteSwap.outboundDelayBlocks,
      totalSwapSeconds: quoteSwap.totalSwapSeconds,
      slipBasisPoints: quoteSwap.slipBasisPoints,
      canSwap: quoteSwap.canSwap,
      errors: quoteSwap.errors,
      warning: quoteSwap.warning,
    })
  }
  //do swap for maya-do-swap
  const doSwap = async (mayachainAmm: MayachainAMM, quoteSwapParams: QuoteSwapParams) => {
    try {
      const quoteSwap = await mayachainAmm.estimateSwap(quoteSwapParams)
      console.log('______________________    ESTIMATION   ____________________')
      printQuoteSwap(quoteSwap)
      if (quoteSwap.canSwap) {
        console.log('______________________      RESULT     ____________________')
        console.log(
          `Executing swap from ${assetToString(quoteSwapParams.fromAsset)} to ${assetToString(
            quoteSwapParams.destinationAsset,
          )}`,
        )
        const txSubmitted = await mayachainAmm.doSwap(quoteSwapParams);
        showNotification ("Transaction success", "success");
        console.log(`Tx hash: ${txSubmitted.hash},\n Tx url: ${txSubmitted.url}\n`)
      } else {
        showNotification(quoteSwap.errors[0], "info");
      }
    } catch (error) {
      console.error(error)
      //@ts-ignore
      showNotification(error.message, "warning");
    }
  }

  const doMayaSwap = async (amount: string | number, affiliateBps: number = 25) => {

    return;
    const decimals = fromToken?.chain === "MAYA" ? 10 : 8;
    console.log(amount, decimals);
    const fromAsset = assetFromString(fromToken?.asset as string)
    const toAsset = assetFromString(toToken?.asset as string);
    // const affiliateAddress = process.argv[8]
    const toChain = toAsset?.synth ? MayaChain : toAsset?.chain
    const quoteSwapParams: QuoteSwapParams = {
      fromAsset: fromAsset as Asset,
      destinationAsset: toAsset as Asset,
      amount: new CryptoAmount(assetToBase(assetAmount(amount, decimals)), fromAsset as Asset),
      affiliateAddress: "maya16y3cuuk4ux4vup9yq238wm8afuna80e53ec87v",
      affiliateBps,
      destinationAddress: await wallet?.getAddress(toChain as string),
      // destinationAddress: xBalances[toToken?.chain as string].address,
    }

    console.log('====================== DO SWAP EXAMPLE ====================')
    console.log('\n\n\n')
    console.log('______________________    SWAP TO DO   ____________________')
    console.log({ ...quoteSwapParams, amount: quoteSwapParams.amount.assetAmount.amount().toString() });

    const mayachainAmm = new MayachainAMM(new MayachainQuery(), wallet);
    console.log(mayachainAmm)
    await doSwap(mayachainAmm, quoteSwapParams);
  }

  return (
    <XChainContext.Provider value={{ connectKeyStoreWallet, getBalances, doMayaSwap }}>
      {children}
    </XChainContext.Provider>
  )
}

export default XChainProvider;