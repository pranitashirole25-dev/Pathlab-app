const xlsx = require('xlsx');

const workbook = xlsx.readFile('./NDS Updated Packages.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

console.log(JSON.stringify(data.slice(0, 3), null, 2));
