const pool = require('../../../db');

class UserModel {
  static async findByEmail(email) {
    const { rows } = await pool.query(
      `SELECT id, email, name, password_hash, onboarding_completed, created_at
       FROM users WHERE email = $1`,
      [email]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const { rows } = await pool.query(
      `SELECT id, email, name, onboarding_completed, created_at
       FROM users WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  static async create({ email, name, passwordHash }) {
    const { rows } = await pool.query(
      `INSERT INTO users (email, name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, onboarding_completed, created_at`,
      [email, name, passwordHash]
    );
    return rows[0];
  }

  static async updateOnboarding(id, completed) {
    const { rows } = await pool.query(
      `UPDATE users SET onboarding_completed = $1
       WHERE id = $2
       RETURNING id, email, name, onboarding_completed, created_at`,
      [completed, id]
    );
    return rows[0] || null;
  }
}

module.exports = UserModel;
