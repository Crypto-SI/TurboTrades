import { atom } from 'jotai';
import { IWallet, IBalance, ChainType, WalletType } from '@/types/minis';

import { InitialwalletList, InitialchainList } from "@/utils/data";
import { isSupportedChain, isXDefiInstalled, isMetamaskInstalled } from '@/utils/methods';

// export const isConnectedAtom = atom<Boolean>(false);
// export const isConnectingAtom = atom<Boolean>(false);
export const isFetchingBalancesAtom = atom<Boolean>(false);

export const walletListAtom = atom<WalletType[]>(InitialwalletList);
export const chainListAtom = atom<ChainType[]>(InitialchainList);
export const walletAtom = atom<WalletType | null>(null);
export const curBalanceAtom = atom<IWallet | undefined>(undefined);

// export const thorLoading = atom<boolean>(false);
// export const mayaLoading = atom<boolean>(false);
// export const ethLoading = atom<boolean>(false);
// export const btcLoading = atom<boolean>(false);
// export const 