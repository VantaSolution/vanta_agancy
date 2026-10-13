import { pool } from '../src/config/db';
import { hashPassword } from '../src/utils/password';
import { env } from '../src/config/env';

async function main() {
  const args = process.argv.slice(2);
  const email = args[0] || process.env.NEW_ADMIN_EMAIL || env.ADMIN_EMAIL || 'admin@vanta.studio';
  const password = args[1] || process.env.NEW_ADMIN_PASSWORD || env.ADMIN_PASSWORD || 'admin123';
  const name = args[2] || 'Admin';
  const role = args[3] || 'admin';

  console.log('--- Admin Account Tool ---');
  console.log(`Target Email: ${email}`);
  console.log(`Target Name:  ${name}`);
  console.log(`Target Role:  ${role}`);

  try {
    // 1. Check existing table
    const existing = await pool.query('SELECT id, email, name, role, created_at FROM admins');
    console.log(`Current admins count: ${existing.rows.length}`);
    if (existing.rows.length > 0) {
      console.log('Existing accounts:');
      existing.rows.forEach((row, i) => {
        console.log(`  [${i + 1}] ID: ${row.id} | Email: ${row.email} | Name: ${row.name} | Role: ${row.role}`);
      });
    }

    // 2. Hash password & Insert or Update
    const passwordHash = await hashPassword(password);
    const result = await pool.query(
      `INSERT INTO admins (email, password_hash, name, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE 
       SET password_hash = $2, name = $3, role = $4, updated_at = NOW()
       RETURNING id, email, name, role`,
      [email, passwordHash, name, role]
    );

    console.log('\n✅ Admin account successfully created/updated:');
    console.log(`   ID:       ${result.rows[0].id}`);
    console.log(`   Email:    ${result.rows[0].email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Name:     ${result.rows[0].name}`);
    console.log(`   Role:     ${result.rows[0].role}`);
  } catch (err) {
    console.error('❌ Failed to add admin account:', err);
  } finally {
    await pool.end();
  }
}

main();
