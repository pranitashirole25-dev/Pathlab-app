import fs from 'fs';
import path from 'path';
import { query } from '../config/db';

async function initDb() {
  try {
    // Check if the database has already been initialized by checking for the users table
    const res = await query(`SELECT to_regclass('public.users') as exists`);
    
    if (!res.rows[0].exists) {
      console.log('⚙️ Initializing database schema...');
      const schemaSql = fs.readFileSync(path.join(process.cwd(), 'schema.sql'), 'utf8');
      await query(schemaSql);
      console.log('✅ Schema created successfully.');
    } else {
      console.log('✅ Database schema already exists. Skipping schema creation.');
    }

    // Seed catalog data
    const dataPath = path.join(process.cwd(), 'src', 'data', 'catalogTests.json');
    if (fs.existsSync(dataPath)) {
      console.log('📦 Found catalog data, syncing with database...');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      for (const item of data) {
        // Upsert by name
        const existing = await query('SELECT id FROM catalog_tests WHERE name = $1', [item.name]);
        if (existing.rowCount > 0) {
          await query(
            `UPDATE catalog_tests SET description = $1, price = $2, type = $3, category = $4, is_active = $5 WHERE name = $6`,
            [item.description || '', item.price || 0, item.type || 'INDIVIDUAL', item.category || 'Other', item.is_active !== false, item.name]
          );
        } else {
          await query(
            `INSERT INTO catalog_tests (name, description, price, type, category, is_active) VALUES ($1, $2, $3, $4, $5, $6)`,
            [item.name, item.description || '', item.price || 0, item.type || 'INDIVIDUAL', item.category || 'Other', item.is_active !== false]
          );
        }
      }
      console.log(`✅ Successfully synced ${data.length} tests in the database!`);
    } else {
      console.log('⚠️ No catalog data found to seed.');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  }
}

initDb();
