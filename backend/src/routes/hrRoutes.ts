import { Router } from 'express';
import { applyForLeave, getLeaveRequests, updateLeaveStatus, getScorecards } from '../controllers/hrController';

const router = Router();

// Leave Management
router.post('/leaves', applyForLeave);
router.get('/leaves', getLeaveRequests);
router.patch('/leaves/:leaveId/status', updateLeaveStatus);

// Scorecards & Salary
router.get('/scorecards', getScorecards);

export default router;
