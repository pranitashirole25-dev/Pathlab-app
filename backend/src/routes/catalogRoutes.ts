import { Router } from 'express';
import { getTests } from '../controllers/catalogController';

const router = Router();

router.get('/tests', getTests);

export default router;
