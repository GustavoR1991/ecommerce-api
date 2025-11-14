
// Importa o pool de conexões com o banco de dados
import pool from '../db'; // Ajuste o caminho para seu arquivo db.ts

// Interface que representa um usuário
export interface User {
  id?: number; // id é opcional, pois é gerado pelo banco
  name: string; // nome do usuário
  email: string; // e-mail do usuário
  password: string; // senha do usuário
}

// Busca todos os usuários no banco de dados
export async function getAllUsers(): Promise<User[]> {
  const result = await pool.query('SELECT * FROM "User" ORDER BY id ASC'); // Busca todos os usuários
  return result.rows; // Retorna os usuários encontrados
}

// Busca um usuário pelo id
export async function getUserById(id: number): Promise<User | null> {
  const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [id]); // Busca pelo id
  return result.rows[0] || null; // Retorna o usuário ou null se não encontrar
}

// Cria um novo usuário
export async function createUser(user: User): Promise<User> {
  const { name, email, password } = user; // Extrai os campos do usuário
  const result = await pool.query(
    `INSERT INTO "User" (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
    [name, email, password]
  ); // Insere o usuário no banco
  return result.rows[0]; // Retorna o usuário criado
}

// Atualiza um usuário existente
export async function updateUser(id: number, user: Partial<User>): Promise<User | null> {
  // Arrays para montar a query dinamicamente
  const fields = [];
  const values = [];
  let index = 1;

  // Adiciona os campos que foram enviados na atualização
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
  // Adiciona o id ao final dos valores
  values.push(id);

  // Monta a query de atualização
  const query = `UPDATE "User" SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
  // Executa a query de atualização
  const result = await pool.query(query, values);

  return result.rows[0] || null; // Retorna o usuário atualizado ou null se não encontrar
}

// Deleta um usuário pelo id
export async function deleteUser(id: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM "User" WHERE id = $1 RETURNING *', [id]); // Deleta o usuário
  return (result.rowCount ?? 0) > 0; // Retorna true se deletou, false se não encontrou
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  const result = await pool.query(
    'SELECT * FROM "User" WHERE email = $1 AND password = $2',
    [email, password]
  );
  return result.rows[0] || null;
}

