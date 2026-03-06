import { Router, Request, Response } from 'express';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.ts';

const router = Router();
const prisma = new PrismaClient();

// GET /api/blog — Public, only published posts
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, page = '1', limit = '12' } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        const where: Record<string, unknown> = { published: true };
        if (category) where.category = category;

        const [posts, total] = await Promise.all([
            prisma.blogPost.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { publishedAt: 'desc' },
                select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, category: true, author: true, tags: true, publishedAt: true },
            }),
            prisma.blogPost.count({ where }),
        ]);

        res.json({ posts, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
    } catch {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// GET /api/blog/admin — Admin: all posts including drafts
router.get('/admin', authenticate, requireAdmin, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(posts);
    } catch {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// GET /api/blog/:slug — Public, single post
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { slug: req.params.slug, published: true },
        });
        if (!post) { res.status(404).json({ error: 'Post not found' }); return; }
        res.json(post);
    } catch {
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// POST /api/blog — Admin only
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, slug, excerpt, content, coverImage, category, author, tags, published } = req.body;
        if (!title || !slug || !content) {
            res.status(400).json({ error: 'title, slug, and content are required' });
            return;
        }
        const post = await prisma.blogPost.create({
            data: {
                title, slug, excerpt, content, coverImage, category: category || 'General',
                author: author || 'StayOs Editorial', tags, published: Boolean(published),
                publishedAt: published ? new Date() : null,
            },
        });
        res.status(201).json(post);
    } catch {
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// PUT /api/blog/:id — Admin only
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, slug, excerpt, content, coverImage, category, author, tags, published } = req.body;
        const post = await prisma.blogPost.update({
            where: { id: req.params.id },
            data: {
                title, slug, excerpt, content, coverImage, category, author, tags,
                published: Boolean(published),
                publishedAt: published ? new Date() : null,
            },
        });
        res.json(post);
    } catch {
        res.status(500).json({ error: 'Failed to update post' });
    }
});

// DELETE /api/blog/:id — Admin only
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await prisma.blogPost.delete({ where: { id: req.params.id } });
        res.json({ message: 'Post deleted' });
    } catch {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

export default router;
