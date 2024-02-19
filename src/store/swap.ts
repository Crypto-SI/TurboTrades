import { IPool } from '@/utils/types';
import { atom } from 'jotai';

/**
 * stage setting atom
 * @String
 */
export const stageAtom = atom<String>("swap");
/**
 * current modalType for creat, import, phrase keystore
 * @String
 */
export const currentModalTypeAtom = atom<String>("");

export const setStageAtom = atom(
    () => "",
    (get, set, item: String) => set(stageAtom, item)
);

export const poolsAtom = atom<IPool[]>([]);
export const fromTokenAtom = atom<IPool | undefined>(undefined);
export const toTokenAtom = atom<IPool | undefined>(undefined);

