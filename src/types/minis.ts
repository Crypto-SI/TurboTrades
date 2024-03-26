import { XChainClient } from '@xchainjs/xchain-client';
import BigNumber from 'bignumber.js';

export type WalletType = {
  name: string;
  image: string,
  supportedChains?: string[],
  focused?: boolean,
  selected?: boolean
};

export type ChainType = {
  name: string;
  label: string;
  image: string,
  selected?: boolean,
  focused?: boolean
};

export interface IBalance {
  address?: string,
  chain?: string,
  decimal?:number,
  amount: BigNumber | string | number,
  asset?: string,
  value?: number,
  // bigIntValue?: string;
  // symbol?: string,
  // ticker?: string,
  // decimalMultiplier?: string,
};

export interface IWallet {
  address: string,
  balance: IBalance[], 
  walletType: string,
  chain?: string
};

export type XClients = Record<string, any>;

export type XBalances = Record<string, IWallet>