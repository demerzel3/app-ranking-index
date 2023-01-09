import fetch from "node-fetch";

import { EXCHANGE_META } from "./meta";
import { Details } from "./types";

const { SLACK_BOT_TOKEN, SLACK_CHANNEL } = process.env;

export const postToSlack = (index: number, details: Details[]) => {
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
