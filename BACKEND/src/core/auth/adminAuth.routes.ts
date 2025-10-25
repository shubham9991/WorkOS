// BACKEND/src/core/auth/adminAuth.routes.ts
import { Router } from 'express';
import { adminAuthController } from './adminAuth.controller';

const router = Router();

router.post('/login', adminAuthController.login);
// router.get('/check', adminAuthController.checkAuth); // Add if you create a check route

export { router as adminAuthRouter };