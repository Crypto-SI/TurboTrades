export interface ILP {
  asset: string,
  cacao_address: string,
  units: string,
  pending_cacao: string,
  pending_asset: string,
  cacao_deposit_value: string,
  asset_deposit_value: string,
  withdraw_counter: string,
  bonded_nodes: string,
}
/**
 * @get the Result
 * @https://midgard.mayachain.info/v2/member/{address}
 * @Result
 */
export interface IMemberPool {
  assetAdded: number,
  assetAddress: string,
  assetDeposit: number,
  assetPending: number,
  assetWithdrawn: number,
  cacaoDeposit: number,
  dateFirstAdded: number,
  dateLastAdded: number,
  liquidityUnits: number,
  pool: string,
  runeAdded: number,
  runeAddress: string,
  runePending: number,
  runeWithdrawn: number,
}
/**
 * depth and price history from midguard v2 api
 */
export interface IDepthPriceHistory {
  assetDepth: number,
  assetPrice: number,
  assetPriceUSD: number,
  endTime: number,
  liquidityUnits: number,
  luvi: number,
  membersCount: number,
  runeDepth: number,
  startTime: number,
  synthSupply: number,
  synthUnits: number,
  units: number,
}
/**
 * pool infomation from midguard api
 */
export interface IPool {
  annualPercentageRate: string,
  asset: string,
  assetDepth: string,
  assetPrice: string,
  assetPriceUSD: string,
  liquidityUnits: string,
  nativeDecimal: string,
  poolAPY: string,
  runeDepth: string,
  saversAPR: string,
  saversDepth: string,
  saversUnits: string,
  status: string,
  synthSupply: string,
  synthUnits: string,
  totalCollateral: string,
  totalDebtTor: string,
  units: string,
  volume24h: string,

  chain: string,
  token: string,
  ticker: string,
  image: string,
  name: string,
  synth?: boolean
  me?: ILP,
  member: IMemberPool[],
  depthHistory?: IDepthPriceHistory[]
}

export interface IQuoteSwapResponse {
  inbound_address: string,
  memo:  string,
  expected_amount_out: string,
  inbound_confirmation_blocks: number,
  inbound_confirmation_seconds: number,
  outbound_delay_blocks: number,
  outbound_delay_seconds: number,
  fees: {
    asset: string,
    affiliate: string,
    outbound: string
  },
  slippage_bps: number
}

export interface ICoin {
  amount: number,
  asset: string
}
export interface ITnx {
  address: string,
  coins: ICoin[],
  txID: string
}
export interface IAction {
  date: number,
  height: number,
  in: ITnx[],
  metadata: any,
  out: any[],
  pools: any[],
  status: string,
  type: string
}
/**
 * interface of xchain add liqudity props
 */
export interface IParamsAddLiquidity {
  asset: string, 
  decimals: number, 
  amount: number,
  recipient: string,
  address: string, 
  mayaAddress: string, 
  mode: string
}
export interface IParamsAddLPAsset {
  asset: string, 
  decimals: number,
  amount: number,
  recipient: string, 
  mayaAddress: string, 
  mode: string
}
export interface IParamsAddLPCACAO {
  asset: string,
  amount: number,
  address: string, 
  mayaAddress: string
}
/**
 * interface of xchain withdraw liqudity props
 */
export interface IParamsWithdrawLiquidity {
  asset: string, 
  decimals: number, 
  bps: string,
  recipient: string,
  address: string, 
  mayaAddress: string, 
  mode: string
}
/**
 * { ASSET, CACAO }
 */
export interface IInboundResults { 
  ASSET: string, 
  CACAO: string 
}