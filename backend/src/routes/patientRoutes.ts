import { Router } from 'express';
import { addPatient, getPatientsByUser } from '../controllers/patientController';

const router = Router();

router.post('/', addPatient);
router.get('/user/:userId', getPatientsByUser);

export default router;
