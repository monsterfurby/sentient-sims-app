import { GlobalMemoryEntity } from '../entities/GlobalMemoryEntity';
import { GlobalMemoryRepository } from '../db/GlobalMemoryRepository';

export class GlobalMemoryService {
    private globalMemoryRepository: GlobalMemoryRepository;

    constructor() {
        this.globalMemoryRepository = new GlobalMemoryRepository();
    }

    public async getAllGlobalMemories(): Promise<GlobalMemoryEntity[]> {
        return this.globalMemoryRepository.getAll();
    }

    public async getGlobalMemoryById(id: number): Promise<GlobalMemoryEntity | null> {
        return this.globalMemoryRepository.getById(id);
    }

    public async createGlobalMemory(memoryData: GlobalMemoryEntity): Promise<GlobalMemoryEntity> {
        return this.globalMemoryRepository.create(memoryData);
    }

    public async updateGlobalMemory(id: number, memoryData: GlobalMemoryEntity): Promise<GlobalMemoryEntity | null> {
        return this.globalMemoryRepository.update(id, memoryData);
    }

    public async deleteGlobalMemory(id: number): Promise<boolean> {
        return this.globalMemoryRepository.delete(id);
    }
}
