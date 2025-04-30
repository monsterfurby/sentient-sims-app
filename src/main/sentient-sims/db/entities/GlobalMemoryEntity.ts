export class GlobalMemoryEntity {
    id?: number;
    content: string;
    importance: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(content: string, importance: number) {
        this.content = content;
        this.importance = importance;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
