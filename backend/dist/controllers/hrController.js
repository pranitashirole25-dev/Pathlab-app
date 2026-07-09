"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScorecards = exports.updateLeaveStatus = exports.getLeaveRequests = exports.applyForLeave = void 0;
const db_1 = require("../config/db");
const applyForLeave = async (req, res) => {
    const { employeeId, startDate, endDate, reason } = req.body;
    try {
        const result = await (0, db_1.query)(`INSERT INTO leaves (employee_id, start_date, end_date, reason) 
       VALUES ($1, $2, $3, $4) RETURNING *`, [employeeId, startDate, endDate, reason]);
        res.status(201).json({ message: 'Leave request submitted', leave: result.rows[0] });
    }
    catch (err) {
        console.error('Error applying for leave:', err);
        res.status(500).json({ error: 'Failed to submit leave request' });
    }
};
exports.applyForLeave = applyForLeave;
const getLeaveRequests = async (req, res) => {
    try {
        // Admin endpoint to view all pending leaves
        const result = await (0, db_1.query)(`
      SELECT l.*, u.phone as employee_phone 
      FROM leaves l 
      JOIN users u ON l.employee_id = u.id 
      ORDER BY created_at DESC
    `);
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch leave requests' });
    }
};
exports.getLeaveRequests = getLeaveRequests;
const updateLeaveStatus = async (req, res) => {
    const { leaveId } = req.params;
    const { status } = req.body; // 'APPROVED' or 'REJECTED'
    try {
        const result = await (0, db_1.query)(`UPDATE leaves SET status = $1 WHERE id = $2 RETURNING *`, [status, leaveId]);
        res.json({ message: `Leave ${status}`, leave: result.rows[0] });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to update leave status' });
    }
};
exports.updateLeaveStatus = updateLeaveStatus;
const getScorecards = async (req, res) => {
    const { month } = req.query; // format 'YYYY-MM-01'
    try {
        // Admin endpoint to compute live salaries
        const result = await (0, db_1.query)(`
      SELECT 
        s.id, 
        u.phone as employee_phone,
        e.base_salary,
        s.incentive_pool,
        s.penalties,
        (e.base_salary + s.incentive_pool - s.penalties) as computed_final_salary
      FROM scorecards s
      JOIN users u ON s.employee_id = u.id
      JOIN employees e ON u.id = e.user_id
      WHERE s.month_start = $1
    `, [month || new Date().toISOString().substring(0, 8) + '01']); // Default to current month
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch scorecards' });
    }
};
exports.getScorecards = getScorecards;
