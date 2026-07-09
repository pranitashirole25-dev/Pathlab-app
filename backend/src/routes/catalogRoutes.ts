import { Router } from 'express';
import { getTests, updateTest, createTest } from '../controllers/catalogController';

const router = Router();

router.get('/tests', getTests);
router.post('/tests', createTest);
router.put('/tests/:id', updateTest);

export default router;
