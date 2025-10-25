// BACKEND/src/index.ts
import 'reflect-metadata'; // Required for TypeORM (even if not used yet)
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Import routers (we'll create this next)
import { adminAuthRouter } from './core/auth/adminAuth.routes';

const app = express();
const PORT = process.env.PORT || 4000;

// --- Middleware ---
app.use(helmet());
app.use(cors());
app.use(express.json());

// --- Log Requests (Optional but helpful) ---
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// --- API Routes ---
// Health Check
app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Mount the admin auth routes
app.use('/api/v1/admin/auth', adminAuthRouter);

// --- Global Error Handler (Basic) ---
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`[WorkSphere BACKEND] Server running on http://localhost:${PORT}`);
    // Database connection logic will go here later
});