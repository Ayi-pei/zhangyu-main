import { Router } from 'express';
import { validateRequest } from '../middleware/validation';
import { authService } from '../services';
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(3)
});

router.post('/login', validateRequest(loginSchema), async (req, res, next) => {
  try {
    const result = await authService.authenticateUser(req.body.email, req.body.password);
    if (result.success && result.data) {
      const token = authService.generateToken(result.data);
      res.json({ token, user: result.data });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    next(error);
  }
});

router.post('/register', validateRequest(registerSchema), async (req, res, next) => {
  try {
    const result = await authService.createUser(req.body);
    if (result.success && result.data) {
      const token = authService.generateToken(result.data);
      res.json({ token, user: result.data });
    } else {
      res.status(400).json({ error: 'Registration failed' });
    }
  } catch (error) {
    next(error);
  }
});

export default router; 