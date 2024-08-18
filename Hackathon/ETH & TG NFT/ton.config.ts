import { resolve } from "path";
import { config as dotenvConfig } from 'dotenv';


dotenvConfig({ path: resolve(__dirname, './.env') });
const { NETWORK } = process.env;

console.log("network", NETWORK)
let networkConfig;

if (NETWORK === 'ton') {
  networkConfig = {
    id: 1234,  // TON 的链 ID
    name: "ton",
    nativeCurrency: {
      name: 'TON',
      symbol: 'TON',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://ton-rpc-endpoint'], // 替换为 TON 的实际 RPC 端点
      },
      public: {
        http: ['https://ton-rpc-endpoint'], // 替换为 TON 的实际 RPC 端点
      },
    },
    blockExplorers: {
      default: { name: 'TONScan', url: 'https://ton-scan' }, // 替换为 TON 的区块浏览器 URL
    },
    testnet: true,
  };
} else {
  networkConfig = {
    id: 1337,
    name: "ganache",
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['http://127.0.0.1:7545'],
      },
      public: {
        http: ['http://127.0.0.1:7545'],
      },
    },
    blockExplorers: {
      default: { name: 'Etherscan', url: 'http://127.0.0.1:7545' },
    },
    testnet: true,
  }
}
console.log("network", networkConfig)
