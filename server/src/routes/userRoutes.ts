// FILEPATH: d:/ayi/zhangyu-main/server/src/routes/userRoutes.ts

import express from 'express';
import { UserController } from '../controllers/userController';
import { checkAuthorization } from '../middleware/auth';
import { validateUserRegistration, validateUserLogin } from '../validators/userValidator';

const router = express.Router();
const userController = new UserController();

router.post('/register', validateUserRegistration, userController.register);
router.post('/login', validateUserLogin, userController.login);
router.get('/profile', checkAuthorization, userController.getProfile);
router.put('/profile', checkAuthorization, userController.updateProfile);

export default router;
