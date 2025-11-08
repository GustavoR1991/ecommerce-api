import { Request, Response } from 'express';
import pool from '../db'; // Ajuste caminho para seu arquivo db.ts que exporta Pool do pg

export async function listUsers(req: Request, res: Response) {
  try {
    const result = await pool.query('SELECT * FROM "User" ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
}

export async function getUserById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
}

export async function createUser(req: Request, res: Response) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO "User" (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
      [name, email, password]
    );
    res.json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') { // código PostgreSQL para violação de unique constraint
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}

export async function updateUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  const { name, email, password } = req.body;
  if (!name && !email && !password) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar' });
  }

  try {
    const fields = [];
    const values = [];
    let index = 1;

    if (name) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }
    if (email) {
      fields.push(`email = $${index++}`);
      values.push(email);
    }
    if (password) {
      fields.push(`password = $${index++}`);
      values.push(password);
    }

    values.push(id);
    const query = `UPDATE "User" SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Id Inválido' });

  try {
    const result = await pool.query('DELETE FROM "User" WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
}
