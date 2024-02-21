import { atom } from 'jotai';
import { XClients, XBalances } from "@/types/minis";

export const xClientsAtom = atom<XClients>({});
export const xBalancesAtom = atom<XBalances>({});
export const balancesLoadingAtom = atom<Record<string, boolean>>({
    "BTC": true,
    "ETH": true,
    "DASH": true,
    "KUJI": true,
    "THOR": true,
    "MAYA": true
});
export const xDefiAddressesAtom = atom<Record<string, string>>({});
export const isConnectingAtom = atom<boolean>(false);
export const isWalletDetectedAtom = atom<boolean>(false);
