import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.ts';

const router = Router();
const prisma = new PrismaClient();

// POST /api/waitlist — Public submission
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, phone, role, preferredLocation, propertyLink, message } = req.body;
        if (!firstName || !lastName || !email || !role) {
            res.status(400).json({ error: 'Missing required fields: firstName, lastName, email, role' });
            return;
        }
        if (!['TENANT', 'LANDLORD'].includes(role)) {
            res.status(400).json({ error: 'Role must be TENANT or LANDLORD' });
            return;
        }

        const application = await prisma.waitlistApplication.create({
            data: { firstName, lastName, email, phone, role, preferredLocation, propertyLink, message },
        });

        res.status(201).json({
            message: 'Application submitted successfully! We\'ll be in touch soon.',
            id: application.id,
        });
    } catch (err: unknown) {
        const error = err as { code?: string };
        if (error.code === 'P2002') {
            res.status(409).json({ error: 'This email has already been submitted' });
            return;
        }
        res.status(500).json({ error: 'Failed to submit application' });
    }
});

// GET /api/waitlist — Admin only, list all with filters
router.get('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status, role, page = '1', limit = '20' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const where: Record<string, unknown> = {};
        if (status) where.status = status;
        if (role) where.role = role;

        const [applications, total] = await Promise.all([
            prisma.waitlistApplication.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
            }),
            prisma.waitlistApplication.count({ where }),
        ]);

        res.json({ applications, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
    } catch {
        res.status(500).json({ error: 'Failed to fetch waitlist' });
    }
});

// PATCH /api/waitlist/:id/status — Admin only, update application status
router.patch('/:id/status', authenticate, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status } = _req.body;
        const updated = await prisma.waitlistApplication.update({
            where: { id: _req.params.id },
            data: { status },
        });
        res.json(updated);
    } catch {
        res.status(500).json({ error: 'Failed to update status' });
    }
});

export default router;
