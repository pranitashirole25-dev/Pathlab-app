import { Router } from 'express';
import { uploadReport } from '../controllers/reportController';

const router = Router();

router.post('/:bookingId/upload', uploadReport);

export default router;
