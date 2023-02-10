import { VercelRequest, VercelResponse } from "@vercel/node";

import { fetchUSFinanceAppIds } from "../src/lib/appStore";
import { fetchExchangesWeighted } from "../src/lib/coingecko";
import { readHistory, storeInHistory } from "../src/lib/database";
import { EXCHANGE_META, ExchangeMeta } from "../src/lib/meta";
import { Details, ExchangeName } from "../src/lib/types";

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    switch (request.method) {
        case "GET":
            await handleGet(request, response);
            return;
        case "POST":
            await handlePost(request, response);
            return;
        default:
            response.status(405).end();
            return;
    }
}

async function handleGet(request: VercelRequest, response: VercelResponse) {
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 3600;
    const records = await readHistory({
        fromTime: thirtyDaysAgo,
    });

    response
        .json(
            records.map((entry) => ({
                ...entry,
                // Round the time to the hour
                time: Math.floor(entry.time / 3600) * 3600,
            }))
        )
        .end();
}

async function handlePost(request: VercelRequest, response: VercelResponse) {
    const [appIdsByRank, exchangeWeight] = await Promise.all([
        fetchUSFinanceAppIds(),
        fetchExchangesWeighted(),
    ]);
    const appIdsByRankMap = appIdsByRank.reduce((map, id, index) => {
        map[id] = index + 1;

        return map;
    }, {} as Record<string, number>);
    const details: Details[] = (
        Object.entries(EXCHANGE_META) as [ExchangeName, ExchangeMeta][]
    ).map(([name, meta]) => {
        const ranking = appIdsByRankMap[meta.appId] ?? null;
        const weight = exchangeWeight[name];
        const impact =
            ranking === null ? 0 : expo((201 - ranking) / 200) * weight;

        return {
            name: name as ExchangeName,
            ranking,
            weight,
            impact,
        };
    });
    const index = details.reduce(
        (currentIndex, { impact }) => currentIndex + impact,
        0
    );

    await storeInHistory(index, details);

    response.json({ index, details }).end();
}

function expo(x: number): number {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}
