import { Request, Response } from 'express';
import { GlobalMemoryEntity } from '../entities/GlobalMemoryEntity';
import { GlobalMemoryService } from '../services/GlobalMemoryService';

export class GlobalMemoryController {
    private globalMemoryService: GlobalMemoryService;

    constructor() {
        this.globalMemoryService = new GlobalMemoryService();
    }

    public async getAllGlobalMemories(req: Request, res: Response): Promise<void> {
        try {
            const memories = await this.globalMemoryService.getAllGlobalMemories();
            res.status(200).json(memories);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch global memories' });
        }
    }

    public async getGlobalMemoryById(req: Request<{ id: string }>, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const memory = await this.globalMemoryService.getGlobalMemoryById(id);
            if (memory) {
                res.status(200).json(memory);
            } else {
                res.status(404).json({ error: 'Global memory not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch global memory' });
        }
    }

    public async createGlobalMemory(req: Request<{}, {}, GlobalMemoryEntity>, res: Response): Promise<void> {
        try {
            const memoryData = req.body;
            const newMemory = await this.globalMemoryService.createGlobalMemory(memoryData);
            res.status(201).json(newMemory);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create global memory' });
        }
    }

    public async updateGlobalMemory(req: Request<{ id: string }, {}, GlobalMemoryEntity>, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const memoryData = req.body;
            const updatedMemory = await this.globalMemoryService.updateGlobalMemory(id, memoryData);
            if (updatedMemory) {
                res.status(200).json(updatedMemory);
            } else {
                res.status(404).json({ error: 'Global memory not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to update global memory' });
        }
    }

    public async deleteGlobalMemory(req: Request<{ id: string }>, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const success = await this.globalMemoryService.deleteGlobalMemory(id);
            if (success) {
                res.status(204).send();
            } else {
                res.status(404).json({ error: 'Global memory not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete global memory' });
        }
    }
}
