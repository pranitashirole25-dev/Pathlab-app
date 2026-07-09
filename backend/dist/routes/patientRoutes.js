"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patientController_1 = require("../controllers/patientController");
const router = (0, express_1.Router)();
router.post('/', patientController_1.addPatient);
router.get('/user/:userId', patientController_1.getPatientsByUser);
exports.default = router;
