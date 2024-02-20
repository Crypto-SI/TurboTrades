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
  bigIntValue?: string;
  address?: string,
  chain?: string,
  decimal?:number,
  amount: BigNumber,
  decimalMultiplier?: string,
  symbol?: string,
  ticker?: string
  value?: number,
};

export interface IWallet {
  address: string,
  balance: IBalance[], 
  walletType: string,
  chain?: string
};

export type XClients = Record<string, XChainClient>;
export type XBalances = Record<string, IWallet>