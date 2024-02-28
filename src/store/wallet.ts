import { atom } from 'jotai';
import { IWallet, ChainType, WalletType } from '@/types/minis';

import { InitialwalletList, InitialchainList } from "@/utils/data";

export const isFetchingBalancesAtom = atom<Boolean>(false);
export const walletListAtom = atom<WalletType[]>(InitialwalletList);
export const chainListAtom = atom<ChainType[]>(InitialchainList);
export const walletAtom = atom<WalletType | null>(null);
export const curBalanceAtom = atom<IWallet | undefined>(undefined);

