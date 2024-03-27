"use client"
import React from "react";
import { useAtom } from "jotai";

//xchain utils
import { baseToAsset } from "@xchainjs/xchain-util";
import { Balance, FeeOption, Network, XChainClient } from "@xchainjs/xchain-client";
import { LIQUIDITY } from '@/utils/constants';
//This can be used for any xchain client
import { Client as BTCClient, defaultBTCParams } from "@xchainjs/xchain-bitcoin";
import { Client as ETHClient, defaultETHParams } from "@/xchains/ethereum";
import { Client as MayaClient } from '@xchainjs/xchain-mayachain';
import { Client as DashClient, defaultDashParams } from '@xchainjs/xchain-dash';
import { Client as KujiraClient, defaultKujiParams } from '@xchainjs/xchain-kujira';
import { Client as THORClient } from "@xchainjs/xchain-thorchain";
import { MayachainAMM } from '@xchainjs/xchain-mayachain-amm'
import { MayaChain, MayachainQuery, QuoteSwap, QuoteSwapParams } from '@xchainjs/xchain-mayachain-query';
import { CryptoAmount, assetAmount, assetFromString, assetToBase, assetToString, Address, Asset, Chain, assetFromStringEx } from '@xchainjs/xchain-util';
import { Wallet } from '@xchainjs/xchain-wallet'
import axios from "axios";
import { sleep } from "@/utils/methods";

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
  QuoteSwapResponseAtom,
  isSwapingAtom,
  trxUrlAtom,
  showTrxModalAtom
} from "@/store";
//public utils
import useNotification from "@/hooks/useNotification";
//types
import { ChainType, XClients, XBalances, IBalance, IWallet } from "@/types/minis";
import { IPool, IParamsAddLiquidity, IParamsWithdrawLiquidity, IParamsAddLPCACAO, IParamsAddLPAsset } from "@/types/maya";
import { NATIVE_TOKENS, MINIMUM_AMOUNT, TOKEN_DATA } from "@/utils/data";

interface IXChainContext {
  /**
   * connect wallet using keystore
   * @param phrase nemnonics
   * @returns Promise<void>
   */
  connectKeyStoreWallet: (phrase: string) => Promise<void>,
  /**
   * get token balances using xchainjs
   * @returns Promise<void>
   */
  getBalances: () => Promise<void>,
  /**
   * do Maya swap using xchainjs
   * @param amount amount to swap
   * @param affiliateBps 0.75
   * @returns Promise<void>
   */
  doMayaSwap: (amount: string | number, affiliateBps: number) => Promise<any>,
  /**
   * tranfer asset for adding liquidty
   * @param param0 IParamsAddLPAsset
   * @returns tx hash
   */
  xChainAddLPAsset: ({ asset, decimals, amount, recipient, mayaAddress, mode }: IParamsAddLPAsset) => Promise<string>,
  /**
   * tranfer asset for adding liquidty
   * @param param0 IParamsAddLPCacao
   * @returns tx hash
   */
  xChainAddLPCACAO: ({ amount, address }: IParamsAddLPCACAO) => Promise<string>,
  /**transfer cacao for symmetric add liquidity
   * transfer token using xchainjs
   * @param asset string "ETH.ETH"
   * @param decimals number 18
   * @param bps string 10000
   * @param recipient string 0x01012050123123....
   * @param address string current asset's address
   * @param mayaAddress string maya12351231
   * @param mode string LIQUIDITY.SYM | LIQUIDITY.ASYM
   * @returns { hash, url }[] | undefined
   */
  xChainWithdrawLiquidity: ({ asset, decimals, bps, recipient, address, mayaAddress, mode }: IParamsWithdrawLiquidity) => Promise<any>
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
  prices["MAYA.CACAO"] = value * 100;
  prices['ETH.USDC'] = 1;

  data.forEach((item: any) => {
    switch (item.asset) {
      case "ETH.ETH":
        prices['ETH.ETH'] = item.balance_cacao / item.balance_asset * value;
        break;
      case "BTC.BTC":
        prices["BTC.BTC"] = item.balance_cacao / item.balance_asset * value;
        break;
      case "THOR.RUNE":
        prices['THOR.RUNE'] = item.balance_cacao / item.balance_asset * value;
        break;
      case "DASH.DASH":
        prices["DASH.DASH"] = item.balance_cacao / item.balance_asset * value;
        break;
      case "KUJI.KUJI":
        prices['KUJI.KUJI'] = item.balance_cacao / item.balance_asset * value;
        break;
      case "KUJI.USK":
        prices["KUJI.USK"] = item.balance_cacao / item.balance_asset * value;
        break;
      case "ETH.USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7":
        prices['ETH.USDT'] = item.balance_cacao / item.balance_asset * value;
        break;
      case "ETH.WSTETH-0X7F39C581F595B53C5CB19BD0B3F8DA6C935E2CA0":
        prices['ETH.WSTETH'] = item.balance_cacao / item.balance_asset * value;
        break;
    }
  });
  return prices;
}

const XChainProvider = ({ children }: { children: React.ReactNode }) => {
  //atoms
  const [fromToken,] = useAtom(fromTokenAtom);
  const [toToken,] = useAtom(toTokenAtom);
  const [, setIsConnecting] = useAtom(isConnectingAtom);
  const [, setIsWalletDetected] = useAtom(isWalletDetectedAtom);
  const [xClients, setXClients] = useAtom(xClientsAtom);
  const [xBalances, setXBalances] = useAtom(xBalancesAtom);
  const [chainList, setChainList] = useAtom(chainListAtom);
  const [showTrxModal, setShowTrxModal] = useAtom(showTrxModalAtom);//show trx modal
  const [trxUrl, setTrxUrl] = useAtom(trxUrlAtom);
  //states
  const [wallet, setWallet] = React.useState<Wallet|undefined>(undefined);
  const [mayaClient, setMayaClient] = React.useState<MayaClient|undefined>(undefined);
  //hooks
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
    setMayaClient (mayaClient);
    // EVM Clients
    const ethClient = new ETHClient({ ...defaultETHParams, network: settings.network, phrase: settings.phrase }) // Ethereum
    //dash &
    const dashClient = new DashClient({ ...defaultDashParams, network: settings.network, phrase: settings.phrase, feeBounds: {upper: 2000, lower: 1}});
    // const dashClient = new DashClient({ ...defaultDashParams, network: settings.network, phrase: settings.phrase });
    
    const kujiClient = new KujiraClient({ ...defaultKujiParams, network: settings.network, phrase: settings.phrase });
    const thorClient = new THORClient(settings);
    //clients
    //@ts-ignore
    const clients: XChainClient[] = [btcClient, mayaClient, ethClient, dashClient, kujiClient, thorClient];
    //wallet
    const _wallet: Wallet = new Wallet({
      BTC: btcClient,
      ETH: ethClient, 
      DASH: dashClient,
      KUJI: kujiClient,
      //@ts-ignore
      THOR: thorClient,
      MAYA: mayaClient,
    });

    setWallet(_wallet);
    setIsWalletDetected(true);
    getBalances (_wallet);
    //save xchainjs clients for if...
    const _clients: XClients = {};
    clients.forEach((_client: XChainClient) => {
      //@ts-ignore
      if (chains.indexOf(_client.chain) !== -1) {
        //@ts-ignore
        _clients[_client.chain] = _client;
      }
    });
    setXClients(_clients);
  }

  const _getBalance = async (wallet: Wallet, chain: Chain,  prices: Record<string, number>, assets?: Asset[]) => {
    try {
      const balances = await wallet.getBalance(chain, assets);
      if (balances.length === 0 || balances === undefined) throw "no balance" //there is no balance
      return balances.map((balance) => ({
        asset: assetToString(balance.asset).split("-")[0],
        amount: baseToAsset(balance.amount).amount().toString(),
        value: prices[assetToString(balance.asset).split("-")[0]]//ETH.USDT-0xdAC17F958 -> ETH.USDT
      }))
    } catch (err) {
      return [{
        asset: NATIVE_TOKENS[chain],
        amount: 0,
        value: prices[NATIVE_TOKENS[chain]]
      }]
    }
  }
  /**
   * get wallet balances
   * @param _wallet 
   */
  const getBalances = async (_wallet: Wallet = wallet as Wallet) => {
    setXBalances({});
    const prices = await _getPrices();
    try {
      setIsConnecting(true);
      const _xBalances: XBalances = {};
      const balances = await Promise.all(chains.map(async (chain: string) => {
        switch (chain) {
          case "ETH": {
            const data = await _getBalance(_wallet, 'ETH', prices, [assetFromStringEx('ETH.ETH'), assetFromStringEx('ETH.USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7'), assetFromStringEx('ETH.USDC-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'), assetFromStringEx('ETH.WSTETH-0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0')])
            const address = await _wallet.getAddress(chain);
            _xBalances[chain] = {
              address,
              chain: chain,
              balance: data,
              walletType: "Keystore"
            }
            break;
          }
          case "BTC": {
            const data = await _getBalance(_wallet, 'BTC', prices)
            const address = await _wallet.getAddress(chain);
            _xBalances[chain] = {
              address,
              chain: chain,
              balance: data,
              walletType: "Keystore"
            }
            break;
          }
          case "KUJI": {
            const data = await _getBalance(_wallet, 'KUJI', prices)
            const address = await _wallet.getAddress(chain);
            _xBalances[chain] = {
              address,
              chain: chain,
              balance: data,
              walletType: "Keystore"
            }
            break;
          }
          case "THOR": {
            const data = await _getBalance(_wallet, 'THOR', prices, [assetFromStringEx('THOR.RUNE')])
            const address = await _wallet.getAddress(chain);
            _xBalances[chain] = {
              address,
              chain: chain,
              balance: data,
              walletType: "Keystore"
            }
            break;
          }
          case "MAYA": {
            const assets = [
              "MAYA.CACAO",
              "KUJI/KUJI",
              "KUJI/USK",
              "ETH/USDT-0xdAC17F958D2ee523a2206206994597C13D831ec7",
              "ETH/USDC-0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
              "ETH/WSTETH-0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
            ]
            const data = await _getBalance(_wallet, 'MAYA', prices, assets.map((_asset: string) => assetFromStringEx(_asset)));
            const address = await _wallet.getAddress(chain);
            _xBalances[chain] = {
              address,
              chain: chain,
              balance: data,
              walletType: "Keystore"
            }
            break;
          }
          case "DASH": {
            const data = await _getBalance(_wallet, 'DASH', prices);
            const address = await _wallet.getAddress(chain);
            _xBalances[chain] = {
              address,
              chain: chain,
              balance: data,
              walletType: "Keystore"
            }
          }
        }
        // _xBalances[chain] = await _getWalletBalance(_xClients[chain as string], prices);
        setXBalances({ ..._xBalances, [chain]: _xBalances[chain] });
        return _xBalances[chain];
      }));
      //console.logg("balances ------------------>", balances);
    } catch (err) {

    } finally {
      setIsConnecting(false);
    }
  }
  /**
   * print quote swap
   * @param quoteSwap 
   */
  const printQuoteSwap = (quoteSwap: QuoteSwap) => {
    //console.logg({
    //   toAddress: quoteSwap.toAddress,
    //   memo: quoteSwap.memo,
    //   expectedAmount: {
    //     asset: assetToString(quoteSwap.expectedAmount.asset),
    //     amount: quoteSwap.expectedAmount.baseAmount.amount().toString(),
    //     decimals: quoteSwap.expectedAmount.baseAmount.decimal,
    //   },
    //   dustThreshold: {
    //     asset: assetToString(quoteSwap.dustThreshold.asset),
    //     amount: quoteSwap.dustThreshold.baseAmount.amount().toString(),
    //     decimals: quoteSwap.dustThreshold.baseAmount.decimal,
    //   },
    //   totalFees: {
    //     asset: assetToString(quoteSwap.fees.asset),
    //     affiliateFee: {
    //       asset: assetToString(quoteSwap.fees.affiliateFee.asset),
    //       amount: quoteSwap.fees.affiliateFee.baseAmount.amount().toString(),
    //       decimals: quoteSwap.fees.affiliateFee.baseAmount.decimal,
    //     },
    //     outboundFee: {
    //       asset: assetToString(quoteSwap.fees.outboundFee.asset),
    //       amount: quoteSwap.fees.outboundFee.baseAmount.amount().toString(),
    //       decimals: quoteSwap.fees.outboundFee.baseAmount.decimal,
    //     },
    //   },
    //   inboundConfirmationSeconds: quoteSwap.inboundConfirmationSeconds,
    //   inboundConfirmationBlocks: quoteSwap.inboundConfirmationBlocks,
    //   outboundDelaySeconds: quoteSwap.outboundDelaySeconds,
    //   outboundDelayBlocks: quoteSwap.outboundDelayBlocks,
    //   totalSwapSeconds: quoteSwap.totalSwapSeconds,
    //   slipBasisPoints: quoteSwap.slipBasisPoints,
    //   canSwap: quoteSwap.canSwap,
    //   errors: quoteSwap.errors,
    //   warning: quoteSwap.warning,
    // })
  }
  /**
   * send ETH to recipient
   * @param quoteSwapParams 
   * @param memo memo to add
   * @param recipient address to send
   * @returns transaction id
   */
  const _transferEther = (quoteSwapParams: QuoteSwapParams, memo: string, recipient: string) => new Promise(async (resolve, reject) => {
    try {
      const ethClient = xClients["ETH"];
      const amount = assetToBase(assetAmount(quoteSwapParams.amount.assetAmount.amount().toString(), 18))
      const asset = quoteSwapParams.fromAsset;

      //console.logg("@dew/ swap to eth ---------------------------->", {
      //   ethClient,
      //   amount,
      //   asset,
      //   recipient,
      //   memo
      // });
      const txid = await ethClient.transfer({
        "amount": amount,
        "recipient": recipient,
        "walletIndex": 0,
        "asset": asset,
        "memo": memo
      });
      resolve(txid);
    } catch (error) {
      //console.logg("error in transfer ETH using xchainjs")
      reject (error);
    }
  });
  //do maya swap
  /**
   * 
   * @param amount amount to swap
   * @param affiliateBps default 0.75%
   */
  const doMayaSwap = async (amount: string | number, affiliateBps: number = 75) => {
    // await sleep (5000);
    // return Promise.resolve("941ADF0C7D272932B8E22DF175E3111CE7E0325BF802653818D8A9105EB819B1");

    let decimals = 8;
    if ( fromToken?.chain === "MAYA" )  decimals = 10;
    if ( fromToken?.chain === "KUJI" )  decimals = 6;
    
    const fromAsset = assetFromString(fromToken?.asset as string)
    const toAsset = assetFromString(toToken?.asset as string);
    const toChain = toAsset?.synth ? MayaChain : toAsset?.chain
    const quoteSwapParams: QuoteSwapParams = {
      fromAsset: fromAsset as Asset,
      destinationAsset: toAsset as Asset,
      amount: new CryptoAmount(assetToBase(assetAmount(amount, decimals)), fromAsset as Asset),
      affiliateAddress: "tt",
      affiliateBps,
      destinationAddress: await wallet?.getAddress(toChain as string),
    }

    //console.logg('@dew1204/______________________    SWAP TO DO   ____________________');
    //console.logg({ ...quoteSwapParams, amount: quoteSwapParams.amount.assetAmount.amount().toString() });

    const mayachainAmm = new MayachainAMM(new MayachainQuery(), wallet);
    //console.logg(mayachainAmm)
    // await doSwap(mayachainAmm, quoteSwapParams);

    try {
      const valid = await mayachainAmm.validateSwap(quoteSwapParams);
      //console.logg("validate------>", valid);
      //console.logg('______________________    ESTIMATION   ____________________')
      const quoteSwap = await mayachainAmm.estimateSwap(quoteSwapParams);
      
      printQuoteSwap(quoteSwap);
      if (!quoteSwap.canSwap) throw { message:  quoteSwap.errors[0] }; //can't swap
      //console.logg('______________________      RESULT     ____________________')
      //console.logg(
      //   `Executing swap from ${assetToString(quoteSwapParams.fromAsset)} to ${assetToString(
      //     quoteSwapParams.destinationAsset,
      //   )}`,
      // );

      const { chain, symbol } = quoteSwapParams.fromAsset;
      if (chain === "ETH" && symbol === "ETH") {
        //console.logg("@dew1204/start with _own transfer ---------------------------------->");
        const txId = await _transferEther (quoteSwapParams, quoteSwap.memo, quoteSwap.toAddress);
        //console.logg("Transaction success..", txId);
        //console.logg(txId)

        showNotification ("Transaction sent successfully", "success");
        setTrxUrl(txId as string);
        setShowTrxModal(true);
      } else {
        //console.logg(quoteSwapParams)
        
        let hash:string = "";
        switch (fromToken?.chain) {
          case "DASH": 
            // hash = await xClients["DASH"].transfer(
            //   {
            //     asset: quoteSwapParams.fromAsset,
            //     amount: quoteSwapParams.amount.baseAmount,
            //     recipient: quoteSwap.toAddress,
            //     memo: quoteSwap.memo,
            //     feeRate:
            //   },
            // ) as string;
            hash = await xClients['DASH'].transfer({
              asset: quoteSwapParams.fromAsset,
              amount: quoteSwapParams.amount.baseAmount,
              recipient: quoteSwap.toAddress,
              memo: quoteSwap.memo,
              feeRate: 100
            });
            break;
          default: 
            const txSubmitted = await mayachainAmm.doSwap(quoteSwapParams);
            hash = txSubmitted.hash;  
        }
        return Promise.resolve(hash);
        // const txSubmitted = await mayachainAmm.doSwap(quoteSwapParams);
        // //console.logg(`Tx`, txSubmitted);
        // return Promise.resolve(txSubmitted.hash);
        // await sleep (5000);
        // return Promise.resolve("01DBF70FF1E82C056382BB177E7709CE665BF33FFDDC138116AF17A6C214CB9A")
      }
    } catch (error) {
      //console.logg("@dew1204/swap error -------------------------------->", error);
      //@ts-ignore
      if (String(error).includes("insufficient funds for intrinsic transaction cost")) {
        showNotification("Insufficient funds for intrinsic transaction cost.", "warning");
      } else {
        //@ts-ignore
        showNotification(String(error.message), "warning");
      }
      return Promise.reject("failed")
    }
  }
  /**
   * transfer assset for add liquidity using xchainjs
   * @param asset "ETH.ETH"
   * @param decimals 18
   * @param amount 0.1
   * @param recipient 0x01012050123123....
   * @param mayaAddress maya12351231
   * @param mode LIQUIDITY.SYM | LIQUIDITY.ASYM
   * @returns { hash, url }[] | undefined
   */
  const xChainAddLPAsset = async({ asset, decimals, amount, recipient, mayaAddress, mode }: IParamsAddLPAsset) => {
    // await sleep(5000); //dash
    // return Promise.resolve("f1b71caf3e7a46c171b7d8bd4c7f0380089874efd075dd8c1259d095a82dbaf0");

    // let _memo = ( mode === LIQUIDITY.SYM ) ? `+:${asset}:${mayaAddress}::tt:75` : `+:${asset}::tt:75`;
    let _memo = ( mode === LIQUIDITY.SYM ) ? `+:${asset}:${mayaAddress}::tt:75` : `+:${asset}`;
    let _asset = assetFromStringEx(asset);
    let _recipient = recipient;
    let _amount = assetAmount(amount, decimals);
    let _assetAmount = assetToBase(_amount);

    //console.logg("@add LP asset ----------------", {
    //   asset: _asset,
    //   amount: _assetAmount.amount(),
    //   recipient: _recipient,
    //   memo: _memo,
    // });

    try {
      const hash = await wallet?.transfer({
        asset: _asset,
        amount: _assetAmount,
        recipient: _recipient,
        memo: _memo,
      });
      showNotification(`${_asset.chain} transaction sent successfully.`, "success"); //show first message
      // return Promise.resolve(String(hash));
      return Promise.resolve(String(hash));
    } catch (err) {
      //console.logg("@while adding asset liquidity ---------------", err);
      return Promise.reject(String(err));
    }
  };
  /**
   * transfer assset for add liquidity using xchainjs
   * @param amount 0.1
   * @param address current asset's address
   * @returns hash 
   */
  const xChainAddLPCACAO = async({ asset, amount, address, mayaAddress }: IParamsAddLPCACAO) => {
    // await sleep(2000); //maya cacao
    // return Promise.reject("19181BF0B03D522EDF13BE5E689D5DF2AF075F6D8A678F74744D3267267F9833");

    const { data }: { data: IPool } = await axios.get(`https://midgard.mayachain.info/v2/pool/${asset}`);
    const cacaoAmount = Number(data.assetPrice)*Number(amount);
    const _asset = assetFromStringEx("MAYA.CACAO");
    const _amount = assetAmount(cacaoAmount, 10);
    const _assetAmount = assetToBase(_amount);
    const _memo = `+:${asset}:${address}::tt:75`;
    // const _memo = `+:${asset}:${address}`;

    //console.logg("@cacao add liquidity -------------", {
    //   asset: _asset,
    //   amount: _assetAmount.amount(),
    //   memo: _memo,
    //   walletIndex: 0
    // });

    try {
      const hash = await wallet?.deposit({
        asset: _asset,
        amount: _assetAmount,
        memo: _memo,
        walletIndex: 0
      });
      showNotification(`${_asset.chain} transaction sent successfully.`, "success"); //show second message
      return Promise.resolve(String(hash));
    } catch (err) {
      //console.logg("@while cacao deposit ---------------", err);
      return Promise.reject(String(err));
    }
  };
  /**
   * transfer token using xchainjs
   * @param asset "ETH.ETH"
   * @param decimals 18
   * @param amount 0.1
   * @param recipient 0x01012050123123....
   * @param address current asset's address
   * @param mayaAddress maya12351231
   * @param mode LIQUIDITY.SYM | LIQUIDITY.ASYM
   * @returns { hash, url }[] | undefined
   */
  const xChainWithdrawLiquidity = async({ asset, decimals, bps, recipient, address, mayaAddress, mode }: IParamsWithdrawLiquidity) => {
    // const testHash = (mode === LIQUIDITY.SYM) ? "5DC3FFAEF8172C70A133A89C1C95892155F0AE7CD8F24C9A0368391174BA016B" : '9C50F501F1202ECB4879FBD937C240EF09E0C080E533EE1EBBC3793FAB4EA411'; //thor test
    // const testHash = (mode === LIQUIDITY.SYM) ? "8403BE1E59E9405B16A7B516A1F8436C73327FC3EE33B53DFA03665629A3F87D" : '994D53C9B56DA388B70F3E30D51F2475D009AD8A2FF178B5E70178FB09A23B92'; //dash test
    // await sleep(5000);
    // return Promise.resolve(testHash);


    // const _memo = mode === LIQUIDITY.SYM ? `-:${asset}:${bps}::tt:75` : `-:${asset}:${bps}:${asset}::tt:75`;
    const _memo = mode === LIQUIDITY.SYM ? `-:${asset}:${bps}` : `-:${asset}:${bps}:${asset}`;
    if (mode === LIQUIDITY.SYM) {
      const cacaoAmount = MINIMUM_AMOUNT['MAYA'];
      const _asset = assetFromStringEx("MAYA.CACAO");
      const _amount = assetAmount(cacaoAmount, 10);
      const _assetAmount = assetToBase(_amount);
  
      //console.logg("@asym Withdraw LP -------------", {
      //   asset: _asset,
      //   amount: _assetAmount.amount(),
      //   memo: _memo,
      //   walletIndex: 0
      // });
      try {
        const hash = await wallet?.deposit({
          asset: _asset,
          amount: _assetAmount,
          memo: _memo,
          walletIndex: 0
        });
        //console.logg("@asym withdraw tx ----------", hash);
        showNotification(`MAYA.CACAO sent successfully.`, "success"); //show second message
        return Promise.resolve(hash);
      } catch (err) {
        //console.logg("@while cacao deposit ---------------", err);
        return Promise.reject(String(err));
      }
    } else if (mode === LIQUIDITY.ASYM) {
      const amount = MINIMUM_AMOUNT[TOKEN_DATA[asset].chain];
      let _asset = assetFromStringEx(asset);
      let _recipient = recipient;
      let _amount = assetAmount(amount, decimals);
      let _assetAmount = assetToBase(_amount);

      //console.logg("@first add asset ----------------", {
      //   asset: _asset,
      //   amount: _assetAmount.amount(),
      //   recipient: _recipient,
      //   memo: _memo,
      // });
      
      try {
        const hash = await wallet?.transfer({
          asset: _asset,
          amount: _assetAmount,
          recipient: _recipient,
          memo: _memo,
        });
        //console.logg("@asym withdraw tx ----------", hash);
        showNotification(`${asset} sent successfully.`, "success"); //show second message
        return Promise.resolve(hash);
      } catch (err) {
        //console.logg("@while token withdraw LP ---------------", err);
        return Promise.reject(String(err));
      }
    }
  }

  return (
    <XChainContext.Provider value={{ connectKeyStoreWallet, getBalances, doMayaSwap, xChainWithdrawLiquidity, xChainAddLPAsset, xChainAddLPCACAO }}>
      {children}
    </XChainContext.Provider>
  )
}

export default XChainProvider;