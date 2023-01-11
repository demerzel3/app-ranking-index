import { getPool } from "./getPool";
import { Details } from "./types";

type HistoryEntry = {
    time: number;
    value: number;
    details: Details[];
};

export const storeInHistory = async (index: number, details: Details[]) => {
    const client = await getPool().connect();
    try {
        await client.query(
            "INSERT INTO history (time, value, details) VALUES (round(extract(epoch from now())), $1, $2)",
            [index, JSON.stringify(details)]
        );
    } catch (err) {
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

        const { time, value, details } = result.rows[0];
        return {
            time: parseFloat(time),
            value: parseFloat(value),
            details,
        };
    } catch (err) {
        console.log(err.stack);
    } finally {
        client.release();
    }
};
