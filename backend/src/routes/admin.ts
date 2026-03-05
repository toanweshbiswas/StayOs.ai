import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.ts';

const router = Router();
const prisma = new PrismaClient();

// GET /api/admin/stats — Admin dashboard aggregate data
// NOTE: Queries are run sequentially (not via Promise.all) because the Supabase
// pgbouncer connection pool has connection_limit=1 and cannot handle parallel queries.
router.get('/stats', authenticate, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const totalProperties = await prisma.property.count();
        const availableProperties = await prisma.property.count({ where: { status: 'AVAILABLE' } });
        const totalWaitlist = await prisma.waitlistApplication.count();
        const pendingWaitlist = await prisma.waitlistApplication.count({ where: { status: 'PENDING' } });
        const openMaintenance = await prisma.maintenanceRequest.count({ where: { status: 'OPEN' } });
        const totalLeases = await prisma.lease.count();
        const activeLeases = await prisma.lease.count({ where: { status: 'ACTIVE' } });
        const totalBlogPosts = await prisma.blogPost.count();
        const publishedPosts = await prisma.blogPost.count({ where: { published: true } });
        const totalJobs = await prisma.careerJob.count({ where: { isActive: true } });
        const totalApplications = await prisma.careerApplication.count();
        const recentWaitlist = await prisma.waitlistApplication.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { firstName: true, lastName: true, email: true, role: true, status: true, createdAt: true } });
        const recentMaintenance = await prisma.maintenanceRequest.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { title: true, category: true, status: true, priority: true, createdAt: true, property: { select: { name: true } } } });
        const propertiesByStatus = await prisma.property.groupBy({ by: ['status'], _count: { status: true } });
        const waitlistByRole = await prisma.waitlistApplication.groupBy({ by: ['role'], _count: { role: true } });

        res.json({
            properties: { total: totalProperties, available: availableProperties },
            waitlist: { total: totalWaitlist, pending: pendingWaitlist },
            maintenance: { open: openMaintenance },
            leases: { total: totalLeases, active: activeLeases },
            blog: { total: totalBlogPosts, published: publishedPosts },
            careers: { activeJobs: totalJobs, totalApplications },
            charts: { propertiesByStatus, waitlistByRole },
            recent: { waitlist: recentWaitlist, maintenance: recentMaintenance },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// GET /api/admin/team — List all admin/editor/viewer users
router.get('/team', authenticate, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const members = await prisma.user.findMany({
            where: { role: { in: ['ADMIN', 'EDITOR', 'VIEWER'] } },
            select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true },
            orderBy: { createdAt: 'asc' },
        });
        res.json(members);
    } catch {
        res.status(500).json({ error: 'Failed to fetch team' });
    }
});

// POST /api/admin/team — Create a new sub-admin/editor/viewer
router.post('/team', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        if (!firstName || !email || !password) {
            res.status(400).json({ error: 'firstName, email, and password are required' });
            return;
        }
        const allowedRoles = ['ADMIN', 'EDITOR', 'VIEWER'];
        if (role && !allowedRoles.includes(role)) {
            res.status(400).json({ error: 'Invalid role' });
            return;
        }
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { firstName, lastName: lastName || '', email, password: hashedPassword, role: role || 'EDITOR' },
            select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true },
        });
        res.status(201).json(user);
    } catch {
        res.status(500).json({ error: 'Failed to create team member' });
    }
});

// DELETE /api/admin/team/:id — Remove a team member
router.delete('/team/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.id === req.params.id) {
            res.status(400).json({ error: 'You cannot remove yourself' });
            return;
        }
        const target = await prisma.user.findUnique({ where: { id: req.params.id } });
        if (!target) { res.status(404).json({ error: 'User not found' }); return; }
        await prisma.user.delete({ where: { id: req.params.id } });
        res.json({ message: 'Member removed' });
    } catch {
        res.status(500).json({ error: 'Failed to remove member' });
    }
});

// POST /api/admin/change-password — Change own password
router.post('/change-password', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({ error: 'currentPassword and newPassword are required' }); return;
        }
        if (newPassword.length < 8) {
            res.status(400).json({ error: 'Password must be at least 8 characters' }); return;
        }
        const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
        if (!user) { res.status(404).json({ error: 'User not found' }); return; }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) { res.status(401).json({ error: 'Current password is incorrect' }); return; }
        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({ where: { id: req.user!.id }, data: { password: hashed } });
        res.json({ message: 'Password updated successfully' });
    } catch {
        res.status(500).json({ error: 'Failed to change password' });
    }
});

export default router;
