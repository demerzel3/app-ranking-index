import { ExchangeName } from "./types";

export type ExchangeMeta = {
    displayName: string;
    appId: string;
    iconUrl: string;
};

// prettier-ignore
export const EXCHANGE_META: Record<ExchangeName, ExchangeMeta> = {
    binance: { displayName: "Binance", appId: "1436799971", iconUrl: "https://is5-ssl.mzstatic.com/image/thumb/Purple123/v4/c6/a1/1b/c6a11b90-e4aa-5ebe-0bb7-4f388cd796a0/AppIcon-0-0-1x_U007emarketing-0-7-0-0-85-220.png/512x512bb.png" },
    bitfinex: { displayName: "Bitfinex", appId: "1436383182", iconUrl: "https://is2-ssl.mzstatic.com/image/thumb/Purple122/v4/81/dd/42/81dd42bd-7eca-299f-e538-adbf8b3eb312/AppIcon-1x_U007emarketing-0-7-0-85-220.png/512x512bb.png" },
    bybit: { displayName: "Bybit", appId: "1488296980", iconUrl: "https://is3-ssl.mzstatic.com/image/thumb/Purple123/v4/42/99/d8/4299d8c2-f291-1b6c-f736-1db4000923ca/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png" },
    coinbase: { displayName: "Coinbase", appId: "886427730", iconUrl: "https://is3-ssl.mzstatic.com/image/thumb/Purple123/v4/27/4e/a3/274ea3f6-6666-8730-6c7c-6d62c33f51c8/AppIcon-0-1x_U007emarketing-0-10-0-85-220.png/512x512bb.png" },
    cryptocom: { displayName: "Crypto.com", appId: "1262148500", iconUrl: "https://is4-ssl.mzstatic.com/image/thumb/Purple123/v4/b2/b0/aa/b2b0aa76-cd69-882e-f094-26896754f499/AppIcon-1x_U007emarketing-0-5-0-85-220.png/512x512bb.png" },
    gemini: { displayName: "Gemini", appId: "1408914447", iconUrl: "https://is4-ssl.mzstatic.com/image/thumb/Purple123/v4/e2/e8/b9/e2e8b96f-4b81-16e1-b863-813bc7b9f512/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png" },
    huobi: { displayName: "Huobi", appId: "1023263342", iconUrl: "https://is5-ssl.mzstatic.com/image/thumb/Purple123/v4/24/26/6c/24266c34-f4fe-e57b-2f82-5d3d5a27f3a1/ProIcon-1x_U007emarketing-0-7-0-85-220.png/512x512bb.png" },
    kraken: { displayName: "Kraken", appId: "1481947260", iconUrl: "https://is5-ssl.mzstatic.com/image/thumb/Purple122/v4/6a/99/a4/6a99a439-ab8d-9825-b543-1f11affc4855/AppIcon-1x_U007emarketing-0-7-0-85-220.png/512x512bb.png" },
    kucoin: { displayName: "KuCoin", appId: "1378956601", iconUrl: "https://is3-ssl.mzstatic.com/image/thumb/Purple113/v4/90/b8/f9/90b8f9b0-82ca-62ed-8dea-a88d1f1adf68/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png" },
    okx: { displayName: "OKX", appId: "1327268470", iconUrl: "https://is3-ssl.mzstatic.com/image/thumb/Purple122/v4/1c/e7/fd/1ce7fd30-3927-1894-fe67-277b3e13d4f1/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.png" },
};
