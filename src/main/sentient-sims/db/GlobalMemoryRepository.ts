import { GlobalMemoryEntity } from '../entities/GlobalMemoryEntity';
import { Database } from './Database';
import { SaveGame } from '../models/SaveGame';

export class GlobalMemoryRepository {
    private db: Database;

    constructor() {
        this.db = new Database();
    }

    public async getAll(saveGame?: SaveGame): Promise<GlobalMemoryEntity[]> {
        const result = await this.db.query('SELECT * FROM global_memories ORDER BY importance DESC', [], saveGame);
        return result.rows.map(this.mapRowToEntity);
    }

    public async getById(id: number, saveGame?: SaveGame): Promise<GlobalMemoryEntity | null> {
        const result = await this.db.query('SELECT * FROM global_memories WHERE id = ?', [id], saveGame);
        if (result.rows.length === 0) {
            return null;
        }
        return this.mapRowToEntity(result.rows[0]);
    }

    public async create(memoryData: GlobalMemoryEntity, saveGame?: SaveGame): Promise<GlobalMemoryEntity> {
        const result = await this.db.query(
            'INSERT INTO global_memories (content, importance, createdAt, updatedAt) VALUES (?, ?, ?, ?)',
            [memoryData.content, memoryData.importance, memoryData.createdAt, memoryData.updatedAt],
            saveGame
        );
        return this.mapRowToEntity({ ...memoryData, id: result.lastID });
    }

    public async update(id: number, memoryData: GlobalMemoryEntity, saveGame?: SaveGame): Promise<GlobalMemoryEntity | null> {
        const existing = await this.getById(id, saveGame);
        if (!existing) {
            return null;
        }

        await this.db.query(
            'UPDATE global_memories SET content = ?, importance = ?, updatedAt = ? WHERE id = ?',
            [memoryData.content, memoryData.importance, memoryData.updatedAt, id],
            saveGame
        );
        return this.mapRowToEntity({ ...memoryData, id });
    }

    public async delete(id: number, saveGame?: SaveGame): Promise<boolean> {
        const result = await this.db.query('DELETE FROM global_memories WHERE id = ?', [id], saveGame);
        return result.changes > 0;
    }

    private mapRowToEntity(row: any): GlobalMemoryEntity {
        return new GlobalMemoryEntity({
            id: row.id,
            content: row.content,
            importance: row.importance,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
        });
    }
}
