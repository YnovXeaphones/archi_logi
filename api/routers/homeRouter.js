import { Router } from 'express';
const router = Router();
import homeController from '../controllers/homeController.js';

router.post('/ping', homeController.ping);
router.post('/register', homeController.register);

export default router;