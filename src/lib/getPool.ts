import { Pool } from "pg";

let pool: Pool | undefined;

export const getPool = (): Pool => {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            max: 1,
        });
    }

    return pool;
};
