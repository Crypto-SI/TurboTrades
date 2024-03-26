export type TxResult = {
  hash: string,
  url: string,
  blockHeight?: number,
  confirmed: boolean,
  confirmations?: number,
  blocktime?: number|string,
  gas: number,
  fee: number
}
export interface IChainData {
  label: string,
  name: string,
  image: string,
  explorer: string,
  txExplorer: string,
  getTransaction: (hash: string) => Promise<TxResult>
} 
export interface IChainListItem {
  label: string,
  name: string,
  image: string,
  explorer: string
} 
export interface ITokenData {
  ticker: string,
  chain: string,
  name: string,
  decimals: number,
  image: string,
  explorer: string,
} 