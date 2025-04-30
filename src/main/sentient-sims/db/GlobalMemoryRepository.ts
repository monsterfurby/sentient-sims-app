import { GlobalMemoryEntity } from '../entities/GlobalMemoryEntity';
import { Database } from './Database';

export class GlobalMemoryRepository {
    private db: Database;

    constructor() {
        this.db = new Database();
    }

    public async getAll(): Promise<GlobalMemoryEntity[]> {
        const result = await this.db.query('SELECT * FROM global_memories ORDER BY importance DESC');
        return result.rows.map(this.mapRowToEntity);
    }

    public async getById(id: number): Promise<GlobalMemoryEntity | null> {
        const result = await this.db.query('SELECT * FROM global_memories WHERE id = $1', [id]);
        return result.rows.length ? this.mapRowToEntity(result.rows[0]) : null;
    }

    public async create(memory: Omit<GlobalMemoryEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<GlobalMemoryEntity> {
        const now = new Date();
        const result = await this.db.query(
            'INSERT INTO global_memories (content, importance, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *',
            [memory.content, memory.importance, now, now]
        );
        return this.mapRowToEntity(result.rows[0]);
    }

    public async update(id: number, memory: Partial<Omit<GlobalMemoryEntity, 'id' | 'createdAt' | 'updatedAt'>>): Promise<GlobalMemoryEntity | null> {
        const now = new Date();
        const result = await this.db.query(
            'UPDATE global_memories SET content = COALESCE($1, content), importance = COALESCE($2, importance), updated_at = $3 WHERE id = $4 RETURNING *',
            [memory.content, memory.importance, now, id]
        );
        return result.rows.length ? this.mapRowToEntity(result.rows[0]) : null;
    }

    public async delete(id: number): Promise<boolean> {
        const result = await this.db.query('DELETE FROM global_memories WHERE id = $1 RETURNING id', [id]);
        return result.rows.length > 0;
    }

    private mapRowToEntity(row: { id: number; content: string; importance: number; created_at: Date; updated_at: Date }): GlobalMemoryEntity {
        return {
            id: row.id,
            content: row.content,
            importance: row.importance,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }
}
