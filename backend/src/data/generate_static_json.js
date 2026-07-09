const fs = require('fs');

const jsonPath = '/tmp/read_excel/packages.json';
const rawData = fs.readFileSync(jsonPath, 'utf8');
const data = JSON.parse(rawData);

const catalogTests = [];
let idCounter = 1;

for (const [categoryName, rows] of Object.entries(data)) {
  if (!Array.isArray(rows) || rows.length === 0) continue;

  const firstRow = rows[0];
  const packageNames = Object.keys(firstRow).filter(k => 
    k !== 'Parameter/Test' && k !== 'Sr. No.' && k !== 'Sr No'
  );

  for (const pkgName of packageNames) {
    let price = 0;
    let descriptionItems = [];

    for (const row of rows) {
      const testName = row['Parameter/Test']?.toString().trim();
      if (!testName) continue;

      const val = row[pkgName];
      if (testName.toLowerCase().includes('package amount')) {
        price = parseFloat(val) || 0;
      } else if (testName.toLowerCase().includes('mrp amount')) {
        // Ignore
      } else if (val === '✅' || val === 'Y' || val === 'Yes' || val === true) {
        descriptionItems.push(testName);
      }
    }

    const description = descriptionItems.join(', ');

    if (price > 0 || descriptionItems.length > 0) {
      catalogTests.push({
        id: idCounter++,
        name: pkgName,
        description: description,
        price: price,
        type: 'PACKAGE',
        category: categoryName,
        is_active: true
      });
    }
  }
}

fs.writeFileSync('src/data/catalogTests.json', JSON.stringify(catalogTests, null, 2));
console.log('Generated src/data/catalogTests.json with ' + catalogTests.length + ' packages.');
