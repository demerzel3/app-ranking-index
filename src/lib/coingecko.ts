import fetch from "node-fetch";

import { ExchangeName } from "./types";

type Exchange = {
    id: string;
    trade_volume_24h_btc_normalized: number;
};

const EXCHANGE_ID_TO_NAME_MAP: Record<string, ExchangeName> = {
    binance: "binance",
    bitfinex: "bitfinex",
    bybit_spot: "bybit",
    gdax: "coinbase",
    crypto_com: "cryptocom",
    gemini: "gemini",
    huobi: "huobi",
    kraken: "kraken",
    kucoin: "kucoin",
    okex: "okx",
};

const fetchExchanges = async (): Promise<Exchange[]> => {
    return fetch("https://api.coingecko.com/api/v3/exchanges", {}).then(
        (response) => response.json()
    );
};

export const fetchExchangesWeighted = async (): Promise<
    Record<ExchangeName, number>
> => {
    const exchanges = await fetchExchanges();

    const [relevantExchanges, totalVolume] = exchanges.reduce(
        ([list, totalVolume], exchange): [Exchange[], number] => {
            const isRelevant = !!EXCHANGE_ID_TO_NAME_MAP[exchange.id];
            if (isRelevant) {
                list.push(exchange);
                totalVolume += exchange.trade_volume_24h_btc_normalized;
            }

            return [list, totalVolume];
        },
        [[] as Exchange[], 0]
    );

    return relevantExchanges.reduce((map, exchange) => {
        const weight = exchange.trade_volume_24h_btc_normalized / totalVolume;
        map[EXCHANGE_ID_TO_NAME_MAP[exchange.id]] = weight;

        return map;
    }, {} as Record<ExchangeName, number>);
};
