import { Request, Response } from 'express';
import { GlobalMemoryEntity } from '../entities/GlobalMemoryEntity';
import { GlobalMemoryService } from '../services/GlobalMemoryService';
import { SaveGame, ToSaveGameType } from '../models/SaveGame';

export class GlobalMemoryController {
    private globalMemoryService: GlobalMemoryService;

    constructor() {
        this.globalMemoryService = new GlobalMemoryService();
    }

    public async getAllGlobalMemories(req: Request, res: Response): Promise<void> {
        try {
            const saveGameName = req.query.saveGameId as string | undefined;
            const saveGameType = req.query.saveGameType as string | undefined;
            let saveGame: SaveGame | undefined;
            if (saveGameName && saveGameType) {
                saveGame = {
                    name: saveGameName,
                    type: ToSaveGameType(saveGameType),
                };
            }
            const memories = await this.globalMemoryService.getAllGlobalMemories(saveGame);
            res.status(200).json(memories);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch global memories' });
        }
    }

    public async getGlobalMemoryById(req: Request<{ id: string }>, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const saveGameName = req.query.saveGameId as string | undefined;
            const saveGameType = req.query.saveGameType as string | undefined;
            let saveGame: SaveGame | undefined;
            if (saveGameName && saveGameType) {
                saveGame = {
                    name: saveGameName,
                    type: ToSaveGameType(saveGameType),
                };
            }
            const memory = await this.globalMemoryService.getGlobalMemoryById(id, saveGame);
            if (memory) {
                res.status(200).json(memory);
            } else {
                res.status(404).json({ error: 'Global memory not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch global memory' });
        }
    }

    public async createGlobalMemory(req: Request<{}, {}, GlobalMemoryEntity & { saveGameId?: string; saveGameType?: string }>, res: Response): Promise<void> {
        try {
            const { saveGameId, saveGameType, ...memoryData } = req.body;
            let saveGame: SaveGame | undefined;
            if (saveGameId && saveGameType) {
                saveGame = {
                    name: saveGameId,
                    type: ToSaveGameType(saveGameType),
                };
            }
            const newMemory = await this.globalMemoryService.createGlobalMemory(memoryData, saveGame);
            res.status(201).json(newMemory);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create global memory' });
        }
    }

    public async updateGlobalMemory(req: Request<{ id: string }, {}, GlobalMemoryEntity & { saveGameId?: string; saveGameType?: string }>, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);
            const { saveGameId, saveGameType, ...memoryData } = req.body;
            let saveGame: SaveGame | undefined;
            if (saveGameId && saveGameType) {
                saveGame = {
                    name: saveGameId,
                    type: ToSaveGameType(saveGameType),
                };
            }
            const updatedMemory = await this.globalMemoryService.updateGlobalMemory(id, memoryData, saveGame);
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
            const saveGameName = req.query.saveGameId as string | undefined;
            const saveGameType = req.query.saveGameType as string | undefined;
            let saveGame: SaveGame | undefined;
            if (saveGameName && saveGameType) {
                saveGame = {
                    name: saveGameName,
                    type: ToSaveGameType(saveGameType),
                };
            }
            const success = await this.globalMemoryService.deleteGlobalMemory(id, saveGame);
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
