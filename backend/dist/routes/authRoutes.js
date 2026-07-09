"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post('/otp/request', authController_1.requestOTP);
router.post('/otp/verify', authController_1.verifyOTP);
exports.default = router;
