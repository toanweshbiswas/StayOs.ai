import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.ts';

const router = Router();
const prisma = new PrismaClient();

// GET /api/maintenance — Admin: all requests, Tenant: own requests
router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status, priority } = req.query;
        const where: Record<string, unknown> = {};
        if (req.user?.role !== 'ADMIN') where.tenantId = req.user?.id;
        if (status) where.status = status;
        if (priority) where.priority = priority;

        const requests = await prisma.maintenanceRequest.findMany({
            where,
            include: { property: { select: { name: true, location: true } }, tenant: { select: { firstName: true, lastName: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(requests);
    } catch {
        res.status(500).json({ error: 'Failed to fetch maintenance requests' });
    }
});

// POST /api/maintenance — Authenticated tenant/user
router.post('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, category, priority, propertyId } = req.body;
        if (!title || !description || !propertyId) {
            res.status(400).json({ error: 'title, description, and propertyId are required' });
            return;
        }

        const request = await prisma.maintenanceRequest.create({
            data: {
                title, description, category: category || 'General',
                priority: priority || 'medium',
                tenantId: req.user!.id,
                propertyId,
            },
        });
        res.status(201).json(request);
    } catch {
        res.status(500).json({ error: 'Failed to create maintenance request' });
    }
});

// PATCH /api/maintenance/:id/status — Admin only
router.patch('/:id/status', authenticate, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status } = _req.body;
        const updated = await prisma.maintenanceRequest.update({
            where: { id: _req.params.id },
            data: {
                status,
                resolvedAt: status === 'RESOLVED' ? new Date() : null,
            },
        });
        res.json(updated);
    } catch {
        res.status(500).json({ error: 'Failed to update status' });
    }
});

export default router;
