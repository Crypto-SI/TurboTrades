import { atom } from 'jotai';
import { XClients, XClientLoading, XBalances } from "@/utils/types";

export const xClientsAtom = atom<XClients>({});
export const xBalancesAtom = atom<XBalances>({});
export const xClientLoadingAtom = atom<XClientLoading>({
    "BTC": false,
    "ETH": false,
    "DASH": false,
    "KUJI": false,
    "THOR": false,
    "MAYA": false
});
export const isConnectingAtom = atom<Boolean>(false);
