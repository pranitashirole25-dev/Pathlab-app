"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hrController_1 = require("../controllers/hrController");
const router = (0, express_1.Router)();
// Leave Management
router.post('/leaves', hrController_1.applyForLeave);
router.get('/leaves', hrController_1.getLeaveRequests);
router.patch('/leaves/:leaveId/status', hrController_1.updateLeaveStatus);
// Scorecards & Salary
router.get('/scorecards', hrController_1.getScorecards);
exports.default = router;
