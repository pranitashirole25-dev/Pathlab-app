import fs from 'fs';
import path from 'path';
import { query } from '../config/db';

async function initDb() {
  try {
    // Check if the database has already been initialized by checking for the users table
    const res = await query(`SELECT to_regclass('public.users') as exists`);
    
    if (res.rows[0].exists) {
      console.log('✅ Database schema already initialized.');
      process.exit(0);
    }
    
    console.log('⚙️ Initializing database schema...');
    
    // The schema.sql is located at the root of the backend folder
    const schemaSql = fs.readFileSync(path.join(process.cwd(), 'schema.sql'), 'utf8');
    await query(schemaSql);
    
    console.log('✅ Schema created successfully.');

    // Seed catalog data
    const dataPath = path.join(process.cwd(), 'src', 'data', 'catalogTests.json');
    if (fs.existsSync(dataPath)) {
      console.log('📦 Found catalog data, seeding database...');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      
      for (const item of data) {
        await query(
          `INSERT INTO catalog_tests (name, description, price, type, category, is_active) VALUES ($1, $2, $3, $4, $5, $6)`,
          [
            item.name, 
            item.description || '', 
            item.price || 0, 
            item.type || 'INDIVIDUAL', 
            item.category || 'Other', 
            item.is_active !== false
          ]
        );
      }
      console.log(`✅ Successfully seeded ${data.length} tests into the database!`);
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
