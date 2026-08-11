import fs from 'fs';
import path from 'path';
import { pool } from '../config/db';

async function migrate() {
  console.log('🚀 Running database migrations...');
  const migrationsDir = path.join(__dirname, 'migrations');

  try {
    if (!fs.existsSync(migrationsDir)) {
      console.log('⚠️ No migrations directory found.');
      return;
    }

    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      console.log(`📦 Executing migration file: ${file}`);
      const sql = fs.readFileSync(filePath, 'utf-8');
      await pool.query(sql);
      console.log(`✅ Completed: ${file}`);
    }

    console.log('\n🎉 All database migrations executed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
