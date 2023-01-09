import { VercelRequest, VercelResponse } from "@vercel/node";

import { fetchUSFinanceAppIds } from "../src/lib/appStore";
import { fetchExchangesWeighted } from "../src/lib/coingecko";
import { storeInHistory } from "../src/lib/database";
import { getPool } from "../src/lib/getPool";
import { EXCHANGE_META } from "../src/lib/meta";
import { postToSlack } from "../src/lib/slack";
import { Details, ExchangeName } from "../src/lib/types";

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    if (request.method !== "POST") {
        response.status(405).end();
        return;
    }

    const [appIdsByRank, exchangeWeight] = await Promise.all([
        fetchUSFinanceAppIds(),
        fetchExchangesWeighted(),
    ]);
    const appIdsByRankMap = appIdsByRank.reduce((map, id, index) => {
        map[id] = index + 1;

        return map;
    }, {} as Record<string, number>);
    const details: Details[] = Object.entries(EXCHANGE_META).map(
        ([name, meta]) => {
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
        }
    );
    const index = details.reduce(
        (currentIndex, { impact }) => currentIndex + impact,
        0
    );

    await postToSlack(index, details);
    await storeInHistory(getPool(), index, details);

    response.json({ index, details }).end();
}

function expo(x: number): number {
    return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}
