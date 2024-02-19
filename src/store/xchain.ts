import { atom } from 'jotai';
import { XClients, XClientLoading, XBalances } from "@/utils/types";

export const xClientsAtom = atom<XClients>({});
export const xBalancesAtom = atom<XBalances>({});
export const xClientLoadingAtom = atom<XClientLoading>({
    "BTC": true,
    "ETH": true,
    "DASH": true,
    "KUJI": true,
    "THOR": true,
    "MAYA": true
});
export const xDefiAddressesAtom = atom<Record<string, string>>({});
export const isConnectingAtom = atom<Boolean>(false);
