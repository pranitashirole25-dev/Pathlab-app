"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTests = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getTests = async (req, res) => {
    const { category } = req.query;
    try {
        const dataPath = path_1.default.join(process.cwd(), 'src', 'data', 'catalogTests.json');
        if (!fs_1.default.existsSync(dataPath)) {
            return res.json([]);
        }
        const fileContent = fs_1.default.readFileSync(dataPath, 'utf8');
        const allTests = JSON.parse(fileContent);
        let filtered = allTests.filter((t) => t.is_active);
        if (category) {
            filtered = filtered.filter((t) => t.category === category);
        }
        res.json(filtered);
    }
    catch (err) {
        console.error('Error fetching tests from JSON:', err);
        res.status(500).json({ error: 'Failed to fetch catalog' });
    }
};
exports.getTests = getTests;
