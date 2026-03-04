import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/careers — Public, active jobs only
router.get('/', async (_req: Request, res: Response): Promise<void> => {
    try {
        const jobs = await prisma.careerJob.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true, title: true, department: true, location: true,
                type: true, experience: true, description: true, requirements: true, createdAt: true,
                _count: { select: { applications: true } },
            },
        });
        res.json(jobs);
    } catch {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// GET /api/careers/:id — Public, single job by ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const job = await prisma.careerJob.findUnique({
            where: { id: req.params.id },
            select: {
                id: true, title: true, department: true, location: true,
                type: true, experience: true, description: true, requirements: true,
                isActive: true, createdAt: true,
                _count: { select: { applications: true } },
            },
        });
        if (!job) { res.status(404).json({ error: 'Job not found' }); return; }
        res.json(job);
    } catch {
        res.status(500).json({ error: 'Failed to fetch job' });
    }
});

// GET /api/careers/admin — Admin: all jobs with full data
router.get('/admin', authenticate, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const jobs = await prisma.careerJob.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { applications: true } } },
        });
        res.json(jobs);
    } catch {
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
});

// GET /api/careers/applications — Admin: all applications
router.get('/applications', authenticate, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { status, jobId } = _req.query;
        const where: Record<string, unknown> = {};
        if (status) where.status = status;
        if (jobId) where.jobId = jobId;

        const applications = await prisma.careerApplication.findMany({
            where,
            include: { job: { select: { title: true, department: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.json(applications);
    } catch {
        res.status(500).json({ error: 'Failed to fetch applications' });
    }
});

// POST /api/careers/apply — Public job application (legacy: body contains jobId)
router.post('/apply', async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, phone, resumeUrl, coverLetter, jobId } = req.body;
        if (!firstName || !email || !jobId) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const job = await prisma.careerJob.findUnique({ where: { id: jobId } });
        if (!job || !job.isActive) {
            res.status(404).json({ error: 'Job not found or no longer active' });
            return;
        }

        const application = await prisma.careerApplication.create({
            data: { firstName, lastName: lastName || '', email, phone, resumeUrl, coverLetter, jobId },
        });
        res.status(201).json({ message: "Application submitted! We'll review it shortly.", id: application.id });
    } catch {
        res.status(500).json({ error: 'Failed to submit application' });
    }
});

// PATCH /api/careers/applications/:id/status — Admin: update application status
router.patch('/applications/:id/status', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const updated = await prisma.careerApplication.update({
            where: { id: req.params.id },
            data: { status: req.body.status },
        });
        res.json(updated);
    } catch {
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// POST /api/careers — Admin: create job
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, department, location, type, experience, description, requirements } = req.body;
        const job = await prisma.careerJob.create({
            data: { title, department, location, type, experience, description, requirements },
        });
        res.status(201).json(job);
    } catch {
        res.status(500).json({ error: 'Failed to create job' });
    }
});

// GET /api/careers/:id — Public, single job by ID (MUST be after all /static routes)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const job = await prisma.careerJob.findUnique({
            where: { id: req.params.id },
            select: {
                id: true, title: true, department: true, location: true,
                type: true, experience: true, description: true, requirements: true,
                isActive: true, createdAt: true,
                _count: { select: { applications: true } },
            },
        });
        if (!job) { res.status(404).json({ error: 'Job not found' }); return; }
        res.json(job);
    } catch {
        res.status(500).json({ error: 'Failed to fetch job' });
    }
});

// POST /api/careers/:id/apply — Public inline apply from job detail page
router.post('/:id/apply', async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, phone, resumeUrl, coverLetter } = req.body;
        if (!firstName || !email) {
            res.status(400).json({ error: 'First name and email are required' }); return;
        }
        const job = await prisma.careerJob.findUnique({ where: { id: req.params.id } });
        if (!job || !job.isActive) {
            res.status(404).json({ error: 'Job not found or no longer active' }); return;
        }
        const application = await prisma.careerApplication.create({
            data: { firstName, lastName: lastName || '', email, phone, resumeUrl, coverLetter, jobId: req.params.id },
        });
        res.status(201).json({ message: "Application submitted!", id: application.id });
    } catch {
        res.status(500).json({ error: 'Failed to submit application' });
    }
});

// PUT /api/careers/:id — Admin: update job
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, department, location, type, experience, description, requirements, isActive } = req.body;
        const job = await prisma.careerJob.update({
            where: { id: req.params.id },
            data: { title, department, location, type, experience, description, requirements, isActive },
        });
        res.json(job);
    } catch {
        res.status(500).json({ error: 'Failed to update job' });
    }
});

export default router;
