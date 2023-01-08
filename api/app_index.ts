import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

type ExchangeName =
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

type Details = {
    name: ExchangeName;
    weight: number;
    impact: number;
    ranking: number | null;
};

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    if (request.method !== "POST") {
        response.status(405).end();
        return;
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
    const details: Details[] = Object.entries(EXCHANGE_META).map(
        ([name, meta]) => {
            const ranking = appIdsByRankMap[meta.appId] ?? null;
            const weight = exchangeWeightByName[name];
            const impact =
                ranking === null ? 0 : expo((201 - ranking) / 200) * weight;

            return {
                name: name as ExchangeName,
                ranking,
                weight,
                impact,
            };
        }
    );
    const index = details.reduce(
        (currentIndex, { impact }) => currentIndex + impact,
        0
    );

    await postToSlack(index, details);

    response.json({ index, details }).end();
}

type ExchangeMeta = {
    displayName: string;
    appId: string;
    iconUrl: string;
};

// prettier-ignore
const EXCHANGE_META: Record<ExchangeName, ExchangeMeta> = {
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

const { SLACK_BOT_TOKEN, SLACK_CHANNEL } = process.env;

const postToSlack = (index: number, details: Details[]) => {
    const displayIndex = Math.round(index * 100);
    // TODO: define thresholds and different definitions
    const indexDescription = "near the bottom";
    const summary = `Time to buy!\nIndex is at *${displayIndex}* (${indexDescription})`;
    const summaryPlain = `Time to buy! Index is at ${displayIndex} (${indexDescription})`;
    const detailsByRankingAndWeight = [...details].sort((det1, det2) => {
        if (det2.ranking === null && det1.ranking !== null) {
            return -1;
        }
        if (det1.ranking === null && det2.ranking !== null) {
            return 1;
        }
        if (det1.ranking === null && det2.ranking === null) {
            return det2.weight - det1.weight;
        }

        return det1.ranking! - det2.ranking!;
    });
    const detailsByRanking = detailsByRankingAndWeight.filter(
        (x) => x.ranking !== null
    );
    const detailsWithoutRanking = detailsByRankingAndWeight.filter(
        (x) => x.ranking === null
    );

    const blocks = [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: summary,
            },
        },
        ...detailsByRanking.map((det) => ({
            type: "context",
            elements: [
                {
                    type: "plain_text",
                    text: `#${det.ranking}`,
                },
                {
                    type: "image",
                    image_url: EXCHANGE_META[det.name].iconUrl,
                    alt_text: EXCHANGE_META[det.name].displayName,
                },
                {
                    type: "mrkdwn",
                    text: `*${EXCHANGE_META[det.name].displayName}*`,
                    verbatim: true,
                },
            ],
        })),
        {
            type: "context",
            elements: [
                {
                    type: "plain_text",
                    text: "> #200",
                },
                ...detailsWithoutRanking.map((det) => ({
                    type: "image",
                    image_url: EXCHANGE_META[det.name].iconUrl,
                    alt_text: EXCHANGE_META[det.name].displayName,
                })),
                {
                    type: "mrkdwn",
                    text: "Everyone else",
                },
            ],
        },
    ];

    return fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
            Accept: "application/json",
            "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({
            channel: SLACK_CHANNEL,
            blocks: JSON.stringify(blocks),
            text: summaryPlain,
        }),
    })
        .then((response) => response.json())
        .then(console.log);
};
