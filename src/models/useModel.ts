import pool from '../db'; // Ajuste o caminho para seu arquivo db.ts

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export async function getAllUsers(): Promise<User[]> {
  const result = await pool.query('SELECT * FROM "User" ORDER BY id ASC');
  return result.rows;
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createUser(user: User): Promise<User> {
  const { name, email, password } = user;
  const result = await pool.query(
    `INSERT INTO "User" (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
    [name, email, password]
  );
  return result.rows[0];
}

export async function updateUser(id: number, user: Partial<User>): Promise<User | null> {
  const fields = [];
  const values = [];
  let index = 1;

  if (user.name) {
    fields.push(`name = $${index++}`);
    values.push(user.name);
  }
  if (user.email) {
    fields.push(`email = $${index++}`);
    values.push(user.email);
  }
  if (user.password) {
    fields.push(`password = $${index++}`);
    values.push(user.password);
  }

  values.push(id);

  const query = `UPDATE "User" SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
  const result = await pool.query(query, values);

  return result.rows[0] || null;
}

export async function deleteUser(id: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM "User" WHERE id = $1 RETURNING *', [id]);
  return (result.rowCount ?? 0) > 0;
}
