import { Router, Response } from 'express';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { authenticate, AuthRequest } from '../middleware/auth.ts';

const router = Router();

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'stayos-images';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Use memory storage — file is uploaded to Supabase, not disk
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// POST /api/upload — Single image upload
router.post('/', authenticate, upload.single('image'), async (req: AuthRequest, res: Response): Promise<void> => {
    if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
    }

    const ext = req.file.originalname.split('.').pop() || 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filename, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false,
        });

    if (error) {
        console.error('Supabase upload error:', error);
        res.status(500).json({ error: 'Upload failed. Check Supabase Storage config.' });
        return;
    }

    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(filename);
    res.json({ url: publicData.publicUrl, filename });
});

// POST /api/upload/multiple — Multiple images
router.post('/multiple', authenticate, upload.array('images', 20), async (req: AuthRequest, res: Response): Promise<void> => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
        res.status(400).json({ error: 'No files uploaded' });
        return;
    }

    const results = await Promise.all(files.map(async (file) => {
        const ext = file.originalname.split('.').pop() || 'jpg';
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
            .from(BUCKET)
            .upload(filename, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) return null;

        const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
        return { url: data.publicUrl, filename, originalName: file.originalname, size: file.size };
    }));

    res.json(results.filter(Boolean));
});

export default router;
