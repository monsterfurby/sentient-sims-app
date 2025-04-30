import { Pool } from 'pg';
import { config } from 'dotenv';

config();

export class Database {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: process.env.DB_USER || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'sentient_sims',
            password: process.env.DB_PASSWORD || 'postgres',
            port: parseInt(process.env.DB_PORT || '5432'),
        });
    }

    public async query(text: string, params?: any[]): Promise<{ rows: any[] }> {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, params);
            return result;
        } finally {
            client.release();
        }
    }

    public async close(): Promise<void> {
        await this.pool.end();
    }
}
