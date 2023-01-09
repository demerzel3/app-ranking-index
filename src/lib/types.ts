export type ExchangeName =
    | "binance"
    | "bitfinex"
    | "bybit"
    | "coinbase"
    | "cryptocom"
    | "gemini"
    | "huobi"
    | "kraken"
    | "kucoin"
    | "okx";

export type Details = {
    name: ExchangeName;
    weight: number;
    impact: number;
    // This is `null` if ranking is above 200 (don't have data after that, but it doesn't matter much).
    ranking: number | null;
};
