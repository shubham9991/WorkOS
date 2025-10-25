// BACKEND/src/core/auth/adminAuth.service.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const adminEmail = process.env.ADMIN_EMAIL;
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1h';

if (!adminEmail || !adminPasswordHash || !jwtSecret) {
    console.error('FATAL ERROR: Admin credentials or JWT secret missing in .env');
    process.exit(1); // Stop the server if config is missing
}

export class AdminAuthService {

    /**
     * Attempts to log in the admin user.
     * @param email - The email provided.
     * @param password - The plain text password provided.
     * @returns A JWT token if successful, otherwise null.
     */
    async login(email?: string, password?: string): Promise<string | null> {
        if (!email || !password) {
            console.warn('Login attempt with missing email or password.');
            return null;
        }

        // 1. Check if the email matches the configured admin email
        if (email !== adminEmail) {
            console.warn(`Login attempt for incorrect email: ${email}`);
            return null;
        }

        // 2. Compare the provided password with the stored hash
        const isPasswordCorrect = await bcrypt.compare(password, adminPasswordHash);

        if (!isPasswordCorrect) {
            console.warn(`Login attempt with incorrect password for email: ${email}`);
            return null;
        }

        // 3. If credentials are correct, generate a JWT
        const payload = {
            email: adminEmail,
            role: 'SUPER_ADMIN' // Identify this token belongs to the internal admin
        };

        try {
            const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn });
            console.log(`Successful login for admin: ${email}`);
            return token;
        } catch (error) {
            console.error('Error signing JWT:', error);
            return null;
        }
    }

    /**
     * Verifies a JWT token.
     * @param token - The JWT token to verify.
     * @returns The decoded payload if valid, otherwise null.
     */
    verifyToken(token?: string): jwt.JwtPayload | string | null {
        if (!token) {
            return null;
        }
        try {
            // Ensure the token is for a SUPER_ADMIN
            const decoded = jwt.verify(token, jwtSecret);
            if (typeof decoded === 'object' && decoded.role === 'SUPER_ADMIN') {
                return decoded;
            }
            console.warn('Attempted to verify token without SUPER_ADMIN role.');
            return null;
        } catch (error) {
            console.error('Error verifying token:', error);
            return null;
        }
    }
}

// Export a singleton instance
export const adminAuthService = new AdminAuthService();