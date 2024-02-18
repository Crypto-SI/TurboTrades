import { atom } from 'jotai';
import { IWallet, IBalance, ChainType, WalletType } from '@/utils/types';

import { InitialwalletList, InitialchainList } from "@/utils/data";
import { isSupportedChain, isXDefiInstalled, isMetamaskInstalled } from '@/utils/methods';

export const walletsAtom = atom<IWallet[]>([]);
// export const isConnectedAtom = atom<Boolean>(false);
// export const isConnectingAtom = atom<Boolean>(false);
export const isFetchingBalancesAtom = atom<Boolean>(false);

export const walletListAtom = atom<WalletType[]>(InitialwalletList);
export const chainListAtom = atom<ChainType[]>(InitialchainList);