import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    if (request.method !== "POST") {
        response.status(405).end();
    }

    const [appIdsByRank, exchanges] = await Promise.all([
        fetchUSFinanceAppIds(),
        fetchExchanges(),
    ]);
    const appIdsByRankMap = appIdsByRank.reduce((map, id, index) => {
        map[id] = index + 1;

        return map;
    }, {} as Record<string, number>);
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
    const exchangeWeightByName = relevantExchanges.reduce((map, exchange) => {
        const weight = exchange.trade_volume_24h_btc_normalized / totalVolume;
        map[EXCHANGE_ID_TO_NAME_MAP[exchange.id]] = weight;

        return map;
    }, {} as Record<ExchangeName, number>);
    const details = Object.entries(APP_IDS).map(([name, id]) => {
        const ranking = appIdsByRankMap[id] ?? null;
        const weight = exchangeWeightByName[name];
        const impact =
            ranking === null ? 0 : expo((201 - ranking) / 200) * weight;

        return {
            name,
            ranking,
            weight,
            impact,
        };
    });
    const index = details.reduce(
        (currentIndex, { impact }) => currentIndex + impact,
        0
    );

    response.json({ index, details }).end();
}

const APP_IDS = {
    binance: "1436799971",
    bitfinex: "1436383182",
    bybit: "1488296980",
    coinbase: "886427730",
    cryptocom: "1262148500",
    gemini: "1408914447",
    huobi: "1023263342",
    kraken: "1481947260",
    kucoin: "1378956601",
    okx: "1327268470",
};

type ExchangeName = keyof typeof APP_IDS;

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

const POP_ID_FREE_APPS = "27";
const GENRE_FINANCE = "6015";
const ITUNES_URL = `https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewTop?genreId=${GENRE_FINANCE}&popId=${POP_ID_FREE_APPS}&dataOnly=true&cc=us`;

type TopCharts = {
    id: string;
    adamIds: string[];
};

type TopChartsResponse = {
    topCharts: TopCharts[];
};

const fetchUSFinanceAppIds = async (): Promise<string[]> => {
    const data = (await fetch(ITUNES_URL, {
        headers: {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "User-Agent":
                "iTunes/11.1.1 (Windows; Microsoft Windows 7 x64 Ultimate Edition Service Pack 1 (Build 7601)) AppleWebKit/536.30.1",
            XAppleStoreFront: "143441­1,17",
        },
    }).then((response) => response.json())) as TopChartsResponse;
    const ids =
        data.topCharts.find((tc) => tc.id === POP_ID_FREE_APPS)?.adamIds || [];

    return ids;
};

type Exchange = {
    id: string;
    trade_volume_24h_btc_normalized: number;
};

const fetchExchanges = async (): Promise<Exchange[]> => {
    return fetch("https://api.coingecko.com/api/v3/exchanges", {}).then(
        (response) => response.json()
    );
};

function expo(x: number): number {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}
