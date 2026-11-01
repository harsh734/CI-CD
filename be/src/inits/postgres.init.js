const pool = require('../../db');

const initPostgres = async () => {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name VARCHAR(120) NOT NULL,
      onboarding_completed BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const alterUsersAddOnboarding = `
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;
  `;

  const dropTasksTable = `DROP TABLE IF EXISTS tasks CASCADE;`;
  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      status VARCHAR(10) DEFAULT 'active'
        CHECK (status IN ('active','completed')),
      priority VARCHAR(10) DEFAULT 'medium'
        CHECK (priority IN ('low','medium','high')),
      category VARCHAR(20) DEFAULT 'work'
        CHECK (category IN ('work','personal','health','learning','shopping')),
      due_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createUsersTable);
    await pool.query(alterUsersAddOnboarding);
    console.log('👤 Users table ready');

    const { rows } = await pool.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_name = 'tasks' AND column_name = 'user_id'`
    );
    if (rows.length === 0) {
      await pool.query(dropTasksTable);
    }
    await pool.query(createTasksTable);
    console.log('📋 Tasks table ready');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error.message);
    throw error;
  }
};

module.exports = { initPostgres };
