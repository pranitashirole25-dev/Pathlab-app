"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const catalogController_1 = require("../controllers/catalogController");
const router = (0, express_1.Router)();
router.get('/tests', catalogController_1.getTests);
exports.default = router;
