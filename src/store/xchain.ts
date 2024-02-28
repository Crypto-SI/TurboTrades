import { atom } from 'jotai';
import { XClients, XBalances } from "@/types/minis";

export const xClientsAtom = atom<XClients>({}); //xClients
export const xBalancesAtom = atom<XBalances>({}); //xBalances...
export const balancesLoadingAtom = atom<Record<string, boolean>>({
    "BTC": true,
    "ETH": true,
    "DASH": true,
    "KUJI": true,
    "THOR": true,
    "MAYA": true
});
export const xDefiAddressesAtom = atom<Record<string, string>>({}); //xDefi wallet addresses
export const isConnectingAtom = atom<boolean>(false); //waiting for connecting...
export const isWalletDetectedAtom = atom<boolean>(false); //wallet detection...
