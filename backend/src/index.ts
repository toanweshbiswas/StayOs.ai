import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';

import authRoutes from './routes/auth.ts';
import propertiesRoutes from './routes/properties.ts';
import waitlistRoutes from './routes/waitlist.ts';
import maintenanceRoutes from './routes/maintenance.ts';
import blogRoutes from './routes/blog.ts';
import careersRoutes from './routes/careers.ts';
import adminRoutes from './routes/admin.ts';
import uploadRoutes from './routes/upload.ts';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'StayOs API (Deno)', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`🚀 StayOs API running at http://localhost:${PORT}`);
    console.log(`📚 Health: http://localhost:${PORT}/api/health`);
});

export default app;
