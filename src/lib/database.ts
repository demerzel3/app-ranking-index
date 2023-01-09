import { Pool } from "pg";
import { Details } from "./types";

export const storeInHistory = async (
    p: Pool,
    index: number,
    details: Details[]
) => {
    const client = await p.connect();
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
