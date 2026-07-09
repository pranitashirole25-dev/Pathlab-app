"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPatientsByUser = exports.addPatient = void 0;
const db_1 = require("../config/db");
const addPatient = async (req, res) => {
    const { userId, firstName, lastName, dob, gender } = req.body;
    try {
        const result = await (0, db_1.query)(`INSERT INTO patients (user_id, first_name, last_name, dob, gender) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`, [userId, firstName, lastName, dob, gender]);
        res.status(201).json({ message: 'Patient added successfully', patient: result.rows[0] });
    }
    catch (err) {
        console.error('Error adding patient:', err);
        res.status(500).json({ error: 'Failed to add patient' });
    }
};
exports.addPatient = addPatient;
const getPatientsByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await (0, db_1.query)(`SELECT * FROM patients WHERE user_id = $1 ORDER BY created_at ASC`, [userId]);
        res.json(result.rows);
    }
    catch (err) {
        console.error('Error fetching patients:', err);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
};
exports.getPatientsByUser = getPatientsByUser;
