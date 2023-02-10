import { getPool } from "./getPool";
import { Details } from "./types";

type HistoryEntry = {
    time: number;
    value: number;
    details: Details[];
};

export const readHistory = async ({
    fromTime,
    toTime,
}: {
    fromTime: number;
    toTime?: number;
}): Promise<HistoryEntry[]> => {
    const client = await getPool().connect();
    try {
        const result =
            typeof toTime === "number"
                ? await client.query(
                      "SELECT * FROM history WHERE time >= $1 AND time <= $2 ORDER BY time limit 1000",
                      [fromTime, toTime]
                  )
                : await client.query(
                      "SELECT * FROM history WHERE time >= $1 ORDER BY time limit 1000",
                      [fromTime]
                  );

        return result.rows.map(parseHistoryEntry);
    } catch (err: any) {
        console.log(err.stack);
    } finally {
        client.release();
    }

    return [];
};

export const storeInHistory = async (index: number, details: Details[]) => {
    const client = await getPool().connect();
    try {
        await client.query(
            "INSERT INTO history (time, value, details) VALUES (round(extract(epoch from now())), $1, $2)",
            [index, JSON.stringify(details)]
        );
    } catch (err: any) {
        console.log(err.stack);
    } finally {
        client.release();
    }
};

export const getLatestEntry = async (): Promise<HistoryEntry | undefined> => {
    const client = await getPool().connect();
    try {
        const result = await client.query(
            "SELECT * FROM history ORDER BY time DESC limit 1"
        );

        if (result.rowCount === 0) {
            return undefined;
        }

        return parseHistoryEntry(result.rows[0]);
    } catch (err: any) {
        console.log(err.stack);
    } finally {
        client.release();
    }
};

function parseHistoryEntry(row: any): HistoryEntry {
    const { time, value, details } = row;

    return {
        time: parseFloat(time),
        value: parseFloat(value),
        details,
    };
}
