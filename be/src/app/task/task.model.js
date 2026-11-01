const pool = require('../../../db');

const TASK_COLUMNS = `
  id,
  user_id      AS "userId",
  title,
  description,
  status,
  priority,
  category,
  due_date     AS "dueDate",
  created_at   AS "createdAt"
`;

class TaskModel {
  static async findAll(userId) {
    const { rows } = await pool.query(
      `SELECT ${TASK_COLUMNS}
       FROM tasks
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async findById(id, userId) {
    const { rows } = await pool.query(
      `SELECT ${TASK_COLUMNS} FROM tasks WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return rows[0] || null;
  }

  static async create(userId, {
    title,
    description = null,
    status = 'active',
    priority = 'medium',
    category = 'work',
    dueDate = null,
  }) {
    const { rows } = await pool.query(
      `INSERT INTO tasks (user_id, title, description, status, priority, category, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${TASK_COLUMNS}`,
      [userId, title, description, status, priority, category, dueDate]
    );
    return rows[0];
  }

  static async update(id, userId, data) {
    const map = {
      title: 'title',
      description: 'description',
      status: 'status',
      priority: 'priority',
      category: 'category',
      dueDate: 'due_date',
    };
    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, column] of Object.entries(map)) {
      if (data[key] !== undefined) {
        fields.push(`${column} = $${idx++}`);
        values.push(data[key]);
      }
    }

    if (fields.length === 0) return this.findById(id, userId);

    values.push(id, userId);
    const { rows } = await pool.query(
      `UPDATE tasks
       SET ${fields.join(', ')}
       WHERE id = $${idx++} AND user_id = $${idx}
       RETURNING ${TASK_COLUMNS}`,
      values
    );
    return rows[0] || null;
  }

  static async delete(id, userId) {
    const { rows } = await pool.query(
      `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING ${TASK_COLUMNS}`,
      [id, userId]
    );
    return rows[0] || null;
  }
}

module.exports = TaskModel;
