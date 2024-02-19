import { ChainType, WalletType } from "@/utils/types";

export const NATIVE_TOKENS = {
  THOR: "RUNE",
  DASH: "DASH",
  KUJI: "KUJI",
  MAYA: "CACAO",
  BTC: "BTC"
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
    name: "Keystore", 
    image: "/images/wallets/keystore.svg",
    supportedChains: ["BTC", "ETH", "MAYA", "DASH", "KUJI", "THOR"],
    focused: false,
    selected: false
  },
  { name: "Create Keystore", image: "mdi:key-add"},
  { name: "Import Phrase", image: "clarity:import-solid-badged"},
  // { 
  //   name: "Coinbase", 
  //   image: "/images/wallets/coinbase.svg",
  //   supportedChains: ["BTC", "LTC", "BCH", "DOGE", "ETH", "AVAX", "BSC", "BNB", "GAIA", "THOR"]
  // },
  // { 
  //   name: "Metamask", 
  //   image: "/images/wallets/metamask.svg",
  //   supportedChains: ["ETH", "AVAX", "BSC"],
  //   // supportedChains: ["ETH"],
  //   focused: false,
  //   selected: false
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