import { Router } from 'express';
import { getPatients, addPatient, getAddresses, addAddress } from '../controllers/userController';

const router = Router();

router.get('/:id/patients', getPatients);
router.post('/:id/patients', addPatient);
router.get('/:id/addresses', getAddresses);
router.post('/:id/addresses', addAddress);

export default router;
