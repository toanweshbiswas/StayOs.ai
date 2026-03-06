import { Router, Request, Response } from 'express';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

// GET /api/auth/setup-db-free - TEMPORARY SEED ROUTE
router.get('/setup-db-free', async (req: Request, res: Response) => {
    try {
        const hashedPassword = await bcrypt.hash('stayos-admin-2026', 10);
        await prisma.user.upsert({
            where: { email: 'admin@stayos.in' },
            update: {},
            create: {
                email: 'admin@stayos.in',
                password: hashedPassword,
                firstName: 'StayOs',
                lastName: 'Admin',
                role: 'ADMIN',
            },
        });
        res.send('Admin account created successfully! You can now log in at https://admin-stayos-ai.netlify.app');
    } catch (err: any) {
        res.status(500).json({ error: 'Setup failed: ' + err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password required' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, firstName, lastName, phone, role } = req.body;
        if (!email || !password || !firstName || !lastName) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                role: role || 'TENANT',
            },
            select: { id: true, email: true, firstName: true, lastName: true, role: true },
        });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
        );

        res.status(201).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

export default router;
