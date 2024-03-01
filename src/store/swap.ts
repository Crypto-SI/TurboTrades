import { IPool, IQuoteSwapResponse } from '@/types/maya';
import { atom } from 'jotai';

//current modal setting
export const currentModalTypeAtom = atom<String>("");

export const poolsAtom = atom<IPool[]>([]);
export const mainPoolsAtom = atom<IPool[]>([]);
export const fromTokenAtom = atom<IPool | undefined>(undefined);
export const toTokenAtom = atom<IPool | undefined>(undefined);
export const tokenPricesAtom = atom<Record<string, string>>({});
export const QuoteSwapResponseAtom = atom<IQuoteSwapResponse|undefined>(undefined);
export const isSwapingAtom = atom<boolean>(false);

export const showTrxModalAtom = atom<boolean>(false);
export const trxUrlAtom = atom<string>("https://app.bidify.cloud");
