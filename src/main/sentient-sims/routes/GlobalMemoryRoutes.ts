import { Router, Request, Response } from 'express';
import { GlobalMemoryController } from '../controllers/GlobalMemoryController';
import { GlobalMemoryEntity } from '../entities/GlobalMemoryEntity';

const router = Router();
const globalMemoryController = new GlobalMemoryController();

// Get all global memories
router.get('/', (req: Request, res: Response) => globalMemoryController.getAllGlobalMemories(req, res));

// Get a specific global memory by ID
router.get('/:id', (req: Request<{ id: string }>, res: Response) => globalMemoryController.getGlobalMemoryById(req, res));

// Create a new global memory
router.post('/', (req: Request<{}, {}, GlobalMemoryEntity>, res: Response) => globalMemoryController.createGlobalMemory(req, res));

// Update a global memory
router.put('/:id', (req: Request<{ id: string }, {}, GlobalMemoryEntity>, res: Response) => globalMemoryController.updateGlobalMemory(req, res));

// Delete a global memory
router.delete('/:id', (req: Request<{ id: string }>, res: Response) => globalMemoryController.deleteGlobalMemory(req, res));

export default router;
