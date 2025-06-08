import { GlobalMemoryEntity } from '../entities/GlobalMemoryEntity';
import { GlobalMemoryRepository } from '../db/GlobalMemoryRepository';
import { SaveGame } from '../models/SaveGame';

export class GlobalMemoryService {
    private globalMemoryRepository: GlobalMemoryRepository;

    constructor() {
        this.globalMemoryRepository = new GlobalMemoryRepository();
    }

    public async getAllGlobalMemories(saveGame?: SaveGame): Promise<GlobalMemoryEntity[]> {
        return this.globalMemoryRepository.getAll(saveGame);
    }

    public async getGlobalMemoryById(id: number, saveGame?: SaveGame): Promise<GlobalMemoryEntity | null> {
        return this.globalMemoryRepository.getById(id, saveGame);
    }

    public async createGlobalMemory(memoryData: GlobalMemoryEntity, saveGame?: SaveGame): Promise<GlobalMemoryEntity> {
        return this.globalMemoryRepository.create(memoryData, saveGame);
    }

    public async updateGlobalMemory(id: number, memoryData: GlobalMemoryEntity, saveGame?: SaveGame): Promise<GlobalMemoryEntity | null> {
        return this.globalMemoryRepository.update(id, memoryData, saveGame);
    }

    public async deleteGlobalMemory(id: number, saveGame?: SaveGame): Promise<boolean> {
        return this.globalMemoryRepository.delete(id, saveGame);
    }
}
