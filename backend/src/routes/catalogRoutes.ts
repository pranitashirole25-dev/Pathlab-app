import { Router } from 'express';
import { getTests, updateTest } from '../controllers/catalogController';

const router = Router();

router.get('/tests', getTests);
router.put('/tests/:id', updateTest);

export default router;
