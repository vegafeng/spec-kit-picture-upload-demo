import { Router, Request, Response } from 'express';

const router = Router();

// Placeholder - will be implemented in Phase 3
router.get('/', (_req: Request, res: Response) => {
  res.status(501).json({
    message: 'Photo management functionality coming soon',
    phase: 'Phase 3 - User Story Implementation',
  });
});

export { router as photoRoutes };
