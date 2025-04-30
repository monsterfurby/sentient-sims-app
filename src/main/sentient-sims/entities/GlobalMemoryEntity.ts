export class GlobalMemoryEntity {
    id?: number;
    content: string;
    importance: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<GlobalMemoryEntity> = {}) {
        this.id = data.id;
        this.content = data.content || '';
        this.importance = data.importance || 0;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    toJSON(): Record<string, any> {
        return {
            id: this.id,
            content: this.content,
            importance: this.importance,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
