import { Request, Response } from 'express';
import { adminAuthService } from './adminAuth.service';

export class AdminAuthController {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        try {
            // Call the service to handle login logic
            const token = await adminAuthService.login(email, password);

            if (token) {
                // Successful login, return the token
                return res.status(200).json({ token });
            } else {
                // Invalid credentials
                return res.status(401).json({ message: 'Invalid credentials.' });
            }
        } catch (error) {
            console.error('Login error in controller:', error);
            // Generic error for unexpected issues
            return res.status(500).json({ message: 'Internal server error during login.' });
        }
    }

    // Example placeholder for a future route to check if a token is valid
    // async checkAuth(req: Request, res: Response) {
    //   // This would typically rely on middleware having verified the token
    //   // and attached user info to req.user (or similar)
    //   // const user = (req as any).user; 
    //   // if (user && user.role === 'SUPER_ADMIN') {
    //   //   return res.status(200).json({ message: 'Authenticated', user });
    //   // } else {
    //   //   return res.status(401).json({ message: 'Not Authenticated or Invalid Role' });
    //   // }
    // }
}

// Export a singleton instance for use in routes
export const adminAuthController = new AdminAuthController();
```eof

Make sure you save this file in the correct location: `C: \Users\Shubham\Desktop\WorkOS\BACKEND\src\core\auth\adminAuth.controller.ts`.

With this file in place, your `adminAuthRouter` should now work correctly. Thanks for catching that!