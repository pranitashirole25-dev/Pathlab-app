"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const db_1 = require("../config/db");
async function seedPackages() {
    try {
        const jsonPath = '/tmp/read_excel/packages.json';
        if (!fs_1.default.existsSync(jsonPath)) {
            console.error('File not found:', jsonPath);
            return;
        }
        const rawData = fs_1.default.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(rawData);
        for (const [categoryName, rows] of Object.entries(data)) {
            if (!Array.isArray(rows) || rows.length === 0)
                continue;
            // Extract package names from the keys of the first row (excluding Parameter/Test and other non-package columns)
            const firstRow = rows[0];
            const packageNames = Object.keys(firstRow).filter(k => k !== 'Parameter/Test' && k !== 'Sr. No.' && k !== 'Sr No');
            for (const pkgName of packageNames) {
                // Find price
                let price = 0;
                let descriptionItems = [];
                for (const row of rows) {
                    const testName = row['Parameter/Test']?.toString().trim();
                    if (!testName)
                        continue;
                    const val = row[pkgName];
                    if (testName.toLowerCase().includes('package amount')) {
                        price = parseFloat(val) || 0;
                    }
                    else if (testName.toLowerCase().includes('mrp amount')) {
                        // Can ignore or store if needed
                    }
                    else if (val === '✅' || val === 'Y' || val === 'Yes' || val === true) {
                        descriptionItems.push(testName);
                    }
                }
                const description = descriptionItems.join(', ');
                if (price > 0 || descriptionItems.length > 0) {
                    // Check if package already exists
                    const res = await (0, db_1.query)('SELECT id FROM catalog_tests WHERE name = $1', [pkgName]);
                    if (res.rowCount === 0) {
                        await (0, db_1.query)(`INSERT INTO catalog_tests (name, description, price, type, category, is_active) 
               VALUES ($1, $2, $3, 'PACKAGE', $4, true)`, [pkgName, description, price, categoryName]);
                        console.log(`Inserted package: ${pkgName} (${categoryName}) - Price: ${price}`);
                    }
                    else {
                        console.log(`Package already exists: ${pkgName}`);
                    }
                }
            }
        }
        console.log('Seeding completed successfully.');
    }
    catch (err) {
        console.error('Error seeding packages:', err);
    }
    finally {
        process.exit(0);
    }
}
seedPackages();
