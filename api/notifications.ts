import { VercelRequest, VercelResponse } from "@vercel/node";

import { getLatestEntry } from "../src/lib/database";
import { postToSlack } from "../src/lib/slack";

export default async function handler(
    request: VercelRequest,
    response: VercelResponse
) {
    if (request.method !== "POST") {
        response.status(405).end();
        return;
    }

    const entry = await getLatestEntry();
    if (!entry) {
        response
            .status(500)
            .json({
                error: "Failed to retrieve the latest entry from the database",
            })
            .end();
        return;
    }

    await postToSlack(entry.value, entry.details);
    response.status(200).end();
}
