import { ChainType, WalletType } from "@/types/minis";

export const NATIVE_TOKENS: Record<string, string> = {
  THOR: "THOR.RUNE",
  DASH: "DASH.DASH",
  KUJI: "KUJI.KUJI",
  MAYA: "MAYA.CACAO",
  BTC: "BTC.BTC",
  ETH: "ETH.ETH",
}
/**
 * initial wallet list
*/
export const InitialwalletList: WalletType[] = [
  {
    name: "XDEFI",
    image: "/images/wallets/xdefi.svg",
    supportedChains: ["BTC", "ETH", "MAYA", "KUJI", "THOR"],
    focused: false,
    selected: false
  },
  {
    name: "Metamask",
    image: "/images/wallets/metamask.svg",
    supportedChains: ["ETH"],
    // supportedChains: ["ETH"],
    focused: false,
    selected: false
  },
  {
    name: "Keystore",
    image: "/images/wallets/keystore.svg",
    supportedChains: ["BTC", "ETH", "MAYA", "DASH", "KUJI", "THOR"],
    focused: false,
    selected: false
  },
  { name: "Create Keystore", image: "mdi:key-add" },
  { name: "Import Phrase", image: "clarity:import-solid-badged" },
  // { 
  //   name: "Coinbase", 
  //   image: "/images/wallets/coinbase.svg",
  //   supportedChains: ["BTC", "LTC", "BCH", "DOGE", "ETH", "AVAX", "BSC", "BNB", "GAIA", "THOR"]
  // },
  // { 
  //   name: "WalletConnect", 
  //   image: "/images/wallets/walletconnect.svg",
  //   supportedChains: ["ETH", "AVAX", "BSC"],
  //   focused: false,
  //   selected: false
  // },
]
/**
 * chain data
 */
export const TOKEN_DATA: Record<string, any> = {
  "MAYA.CACAO": {
    ticker: "CACAO",
    chain: "MAYA",
    name: "Maya chain",
    decimals: 10,
    image: "/images/tokens/cacao.png"
  },
  "BTC.BTC": {
    ticker: "BTC",
    chain: "BTC",
    name: "Bitcoin",
    decimals: 8,
    image: "/images/tokens/btc.webp"
  },
  "ETH.ETH": {
    ticker: "ETH",
    chain: "ETH",
    name: "Ethereum",
    decimals: 18,
    image: "/images/tokens/eth.png"
  },
  "KUJI.KUJI": {
    ticker: "KUJI",
    chain: "KUJI",
    name: "Kuji chain",
    decimals: 6,
    image: "/images/tokens/kuji.png"
  },
  "DASH.DASH": {
    ticker: "DASH",
    chain: "DASH",
    name: "Dash chain",
    decimals: 8,
    image: "/images/tokens/dash.png"
  },
  "THOR.RUNE": {
    ticker: "RUNE",
    chain: "THOR",
    name: "Thorchain",
    decimals: 8,
    image: "/images/tokens/rune.png"
  },
  "ETH.USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7": {
    ticker: "USDT",
    chain: "ETH",
    decimals: 6,
    name: "Ethereum",
    image: "/images/tokens/usdt.png"
  },
  "ETH.USDT": {
    ticker: "USDT",
    chain: "ETH",
    name: "Ethereum",
    decimals: 6,
    image: "/images/tokens/usdt.png"
  },
  "ETH.USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48": {
    ticker: "USDC",
    chain: "ETH",
    name: "Ethereum",
    decimals: 6,
    image: "/images/tokens/usdc.png"
  },
  "ETH.USDC": {
    ticker: "USDC",
    chain: "ETH",
    name: "Ethereum",
    decimals: 6,
    image: "/images/tokens/usdc.png"
  },
  "ETH.WSTETH-0X7F39C581F595B53C5CB19BD0B3F8DA6C935E2CA0": {
    ticker: "WSTETH",
    chain: "ETH",
    name: "Ethereum",
    decimals: 18,
    image: "/images/tokens/wsteth.png"
  },
  "ETH.WSTETH": {
    ticker: "WSTETH",
    chain: "ETH",
    name: "Ethereum",
    decimals: 18,
    image: "/images/tokens/wsteth.png"
  },
  "KUJI.USK": {
    ticker: "USK",
    chain: "KUJI",
    name: "KUJI chain",
    decimals: 6,
    image: "/images/tokens/usk.png"
  },
  "BTC/BTC": {
    ticker: "sBTC",
    chain: "MAYA",
    name: "Bitcoin",
    decimals: 8,
    image: "/images/tokens/btc.webp"
  },
  "ETH/ETH": {
    ticker: "sETH",
    chain: "MAYA",
    decimals: 18,
    name: "Ethereum",
    image: "/images/tokens/eth.png"
  },
  "KUJI/KUJI": {
    ticker: "sKUJI",
    chain: "MAYA",
    decimals: 8,
    name: "Kuji chain",
    image: "/images/tokens/kuji.png"
  },
  "DASH/DASH": {
    ticker: "sDASH",
    chain: "MAYA",
    name: "Dash chain",
    decimals: 8,
    image: "/images/tokens/dash.png"
  },
  "THOR/RUNE": {
    ticker: "sRUNE",
    chain: "MAYA",
    name: "Thorchain",
    decimals: 8,
    image: "/images/tokens/rune.png"
  },
  "ETH/USDT-0XDAC17F958D2EE523A2206206994597C13D831EC7": {
    ticker: "sUSDT",
    chain: "MAYA",
    name: "Ethereum",
    decimals: 6,
    image: "/images/tokens/usdt.png"
  },
  "ETH/USDC-0XA0B86991C6218B36C1D19D4A2E9EB0CE3606EB48": {
    ticker: "sUSDC",
    chain: "MAYA",
    decimals: 6,
    name: "Ethereum",
    image: "/images/tokens/usdc.png"
  },
  "ETH/WSTETH-0X7F39C581F595B53C5CB19BD0B3F8DA6C935E2CA0": {
    ticker: "sWSTETH",
    chain: "MAYA",
    decimals: 18,
    name: "Ethereum",
    image: "/images/tokens/wsteth.png"
  },
  "KUJI/USK": {
    ticker: "sUSK",
    chain: "MAYA",
    name: "KUJI chain",
    decimals: 8,
    image: "/images/tokens/usk.png"
  },
  "ETH/USDT": {
    ticker: "sUSDT",
    chain: "MAYA",
    name: "Ethereum",
    decimals: 18,
    image: "/images/tokens/usdt.png"
  },
  "ETH/USDC": {
    ticker: "sUSDC",
    chain: "MAYA",
    name: "Ethereum",
    decimals: 6,
    image: "/images/tokens/usdc.png"
  },
  "ETH/WSTETH": {
    ticker: "sWSTETH",
    chain: "MAYA",
    name: "Ethereum",
    decimals: 18,
    image: "/images/tokens/wsteth.png"
  },
}
/**
 * chain data
 */
export const CHAIN_DATA: Record<string, any> = {
  "MAYA": {
    label: "MAYA",
    name: "Maya chain",
    image: "/images/chains/maya.png"
  },
  "BTC": {
    label: "BTC",
    name: "Bitcoin",
    image: "/images/chains/btc.webp"
  },
  "ETH": {
    label: "ETH",
    name: "Ethereum",
    image: "/images/chains/eth.webp"
  },
  "KUJI": {
    label: "KUJI",
    name: "Kuji chain",
    image: "/images/chains/kuji.png"
  },
  "DASH": {
    label: "DASH",
    name: "Dash chain",
    image: "/images/chains/dash.png"
  },
  "THOR": {
    label: "THOR",
    name: "Thorchain",
    image: "/images/chains/thor.webp"
  },
}
/**
 * initial wallet list
 */
export const InitialchainList: ChainType[] = [
  {
    label: "MAYA",
    name: "Maya chain",
    image: "/images/chains/maya.png",
    selected: false,
    focused: false
  },
  {
    label: "BTC",
    name: "Bitcoin",
    image: "/images/chains/btc.webp",
    selected: false,
    focused: false
  },
  {
    label: "ETH",
    name: "Ethereum",
    image: "/images/chains/eth.webp",
    selected: false,
    focused: false
  },
  {
    label: "KUJI",
    name: "Kuji chain",
    image: "/images/chains/kuji.png",
    selected: false,
    focused: false
  },
  {
    label: "DASH",
    name: "Dash chain",
    image: "/images/chains/dash.png",
    selected: false,
    focused: false
  },
  {
    label: "THOR",
    name: "Thorchain",
    image: "/images/chains/thor.webp",
    selected: false,
    focused: false
  },
  // { 
  //   label: "LTC", 
  //   name: "Litecoin", 
  //   image: "/images/chains/ltc.webp", 
  //   selected: false,
  //   focused: false 

  // },
  // { 
  //   label: "BCH", 
  //   name: "Bitcoin Cash", 
  //   image: "/images/chains/bch.webp", selected: false,
  //   focused: false 
  // },
  // { 
  //   label: "DOGE", 
  //   name: "Degecoin", 
  //   image: "/images/chains/doge.webp", 
  //   selected: false,
  //   focused: false 
  // }, 
  // { 
  //   label: "AVAX", 
  //   name: "Avalanche", 
  //   image: "/images/chains/avax.webp", 
  //   selected: false,
  //   focused: false 
  //  },
  // { 
  //   label: "BSC", 
  //   name: "BNB Smart Chain", 
  //   image: "/images/chains/bsc.webp", 
  //   selected: false,
  //   focused: false 
  //  },
  // { 
  //   label: "BNB", 
  //   name: "BNB Beacon Chain", 
  //   image: "/images/chains/bnb.webp", 
  //   selected: false,
  //   focused: false 
  // },
  // { 
  //   label: "GAIA", 
  //   name: "Cosmos chain", 
  //   image: "/images/chains/cosmos.webp", 
  //   selected: false,
  //   focused: false 
  //  },
  // { 

]
/**
 * get chain name by token
 * @ CHAIN_BY_TOKEN["ETH"] => Ethereum
 */
export const CHAIN_BY_TOKEN = {
  "THOR": "Thorchain",
  "BNB": "BNB chain",
  "BSC": "Biance Smart Chain",
  "BTC": "Bitcoin chain",
  "ETH": "Ethereum",
  "DOGE": "Doge chain",
  "AVAX": "Avalanche",
  "GAIA": "Cosmos chain",
  "BCH": "Bitcoin cash",
  "CACAO": "Maya chain",
  "ATOM": "Cosmos chain",
  "LTC": "Litecoin",
  "DASH": "Dash chain",
  "KUJI": "Kuji chain"
}

//ERC20 token addresses
export const ERC_20_ADDRESSES: Record<string, string> = {
  "ETH": "0x0000000000000000000000000000000000000000",
  "USDT": "0xdac17f958d2ee523a2206206994597c13d831ec7",
  "USDC": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  "WSTETH": "0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0"
}
//Ethereum Router
export const EVM_ROUTER_ADDRESS = "0xe3985E6b61b814F7Cdb188766562ba71b446B46d";
//ERC20 decimals
export const ERC20_DECIMALS: Record<string, number> ={
  "ETH": 18,
  "USDT": 6,
  "USDC": 6,
  "WSTETH": 18
}
//dust thresholds
export const DUST_THRESHOLDS = {
  "BTC": 0.0001,
  "DASH": 0.0001
}
//fee estimations
export const FEE_ESTIMATIONS: Record<string, number> = {
  "MAYA": 0.5,
  "BTC": 0.0001,
  "ETH": 0.003,
  "KUJI": 0.0005,
  "DASH": 0.0002,
  "THOR": 0.05, //0.02
}
