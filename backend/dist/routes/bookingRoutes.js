"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const router = (0, express_1.Router)();
router.post('/', bookingController_1.createBooking);
router.post('/:id/cancel', bookingController_1.cancelBooking);
router.get('/history/:userId', bookingController_1.getBookingHistory);
exports.default = router;
