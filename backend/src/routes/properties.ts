import { Router, Request, Response } from 'express';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.ts';

const router = Router();
const prisma = new PrismaClient();

// GET /api/properties — Public, with optional filters
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { location, status, bhk, minPrice, maxPrice, femaleOnly } = req.query;

        const where: Record<string, unknown> = {};
        if (location && location !== 'All Locations') where.location = location;
        if (status) where.status = status;
        if (bhk) where.bhk = Number(bhk);
        if (femaleOnly === 'true') where.isFemaleOnly = true;
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) (where.price as Record<string, number>).gte = Number(minPrice);
            if (maxPrice) (where.price as Record<string, number>).lte = Number(maxPrice);
        }

        const properties = await prisma.property.findMany({
            where,
            include: { images: { where: { isPrimary: true }, take: 1 } },
            orderBy: { createdAt: 'desc' },
        });

        res.json(properties);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});

// GET /api/properties/:id — Public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const property = await prisma.property.findUnique({
            where: { id: req.params.id },
            include: { images: true },
        });
        if (!property) {
            res.status(404).json({ error: 'Property not found' });
            return;
        }
        res.json(property);
    } catch {
        res.status(500).json({ error: 'Failed to fetch property' });
    }
});

// POST /api/properties — Admin only
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, location, neighborhood, address, sqft, bhk, price, status, availableDate,
            availableRooms, totalRooms, isFemaleOnly, description, occupancyDescription,
            amenities, images } = req.body;

        const property = await prisma.property.create({
            data: {
                name, location, neighborhood, address, sqft: Number(sqft), bhk: Number(bhk),
                price: Number(price), status, availableDate, availableRooms,
                totalRooms: Number(totalRooms), isFemaleOnly: Boolean(isFemaleOnly),
                description, occupancyDescription, amenities,
                images: images?.length
                    ? { create: images.map((img: { url: string; alt?: string; isPrimary?: boolean }) => ({ url: img.url, alt: img.alt, isPrimary: img.isPrimary || false })) }
                    : undefined,
            },
            include: { images: true },
        });

        res.status(201).json(property);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create property' });
    }
});

// PUT /api/properties/:id — Admin only
router.put('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, location, neighborhood, address, sqft, bhk, price, status, availableDate,
            availableRooms, totalRooms, isFemaleOnly, description, occupancyDescription, amenities } = req.body;

        const property = await prisma.property.update({
            where: { id: req.params.id },
            data: {
                name, location, neighborhood, address,
                ...(sqft && { sqft: Number(sqft) }),
                ...(bhk && { bhk: Number(bhk) }),
                ...(price && { price: Number(price) }),
                status, availableDate, availableRooms,
                ...(totalRooms && { totalRooms: Number(totalRooms) }),
                ...(isFemaleOnly !== undefined && { isFemaleOnly: Boolean(isFemaleOnly) }),
                description, occupancyDescription, amenities,
            },
            include: { images: true },
        });

        res.json(property);
    } catch {
        res.status(500).json({ error: 'Failed to update property' });
    }
});

// DELETE /api/properties/:id — Admin only
router.delete('/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await prisma.property.delete({ where: { id: req.params.id } });
        res.json({ message: 'Property deleted successfully' });
    } catch {
        res.status(500).json({ error: 'Failed to delete property' });
    }
});

export default router;
