
// Importa os tipos Request e Response do Express
import { Request, Response } from 'express';
// Importa o pool de conexões com o banco de dados
import pool from '../db'; // Ajuste caminho para seu arquivo db.ts que exporta Pool do pg

// Login de usuário

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Preencha todos os campos" });

  try {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: "Email ou senha inválidos" });

    const user = result.rows[0];
    delete user.password; // opcional: não retornar a senha
    res.json(user);
  } catch {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
}


// Lista todos os usuários
export async function listUsers(req: Request, res: Response) {
  try {
    // Executa a query para buscar todos os usuários ordenados por id
    const result = await pool.query('SELECT * FROM "User" ORDER BY id ASC');
    // Retorna os usuários em formato JSON
    res.json(result.rows);
  } catch (error) {
    // Em caso de erro, retorna erro 500
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
}

// Busca um usuário pelo id
export async function getUserById(req: Request, res: Response) {
  // Converte o parâmetro id para número
  const id = Number(req.params.id);
  // Se não for número, retorna erro 400
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    // Busca o usuário pelo id
    const result = await pool.query('SELECT * FROM "User" WHERE id = $1', [id]);
    // Se não encontrar, retorna erro 404
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    // Retorna o usuário encontrado
    res.json(result.rows[0]);
  } catch (error) {
    // Em caso de erro, retorna erro 500
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
}

// Cria um novo usuário
export async function createUser(req: Request, res: Response) {
  // Extrai os campos do corpo da requisição
  const { name, email, password } = req.body;
  // Valida se todos os campos obrigatórios foram preenchidos
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos' });
  }

  try {
    // Insere o novo usuário no banco de dados
    const result = await pool.query(
      `INSERT INTO "User" (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
      [name, email, password]
    );
    // Retorna o usuário criado
    res.json(result.rows[0]);
  } catch (error: any) {
    // Se o erro for de e-mail duplicado (unique constraint)
    if (error.code === '23505') { // código PostgreSQL para violação de unique constraint
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }
    // Em caso de outro erro, retorna erro 500
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}

// Atualiza um usuário existente
export async function updateUser(req: Request, res: Response) {
  // Converte o parâmetro id para número
  const id = Number(req.params.id);
  // Se não for número, retorna erro 400
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  // Extrai os campos do corpo da requisição
  const { name, email, password } = req.body;
  // Se nenhum campo foi enviado, retorna erro 400
  if (!name && !email && !password) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar' });
  }

  try {
    // Arrays para montar a query dinamicamente
    const fields = [];
    const values = [];
    let index = 1;

    // Adiciona os campos que foram enviados na requisição
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

    // Adiciona o id ao final dos valores
    values.push(id);
    // Monta a query de atualização
    const query = `UPDATE "User" SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
    // Executa a query de atualização
    const result = await pool.query(query, values);

    // Se não encontrar o usuário, retorna erro 404
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
    // Retorna o usuário atualizado
    res.json(result.rows[0]);
  } catch (error: any) {
    // Se o erro for de e-mail duplicado (unique constraint)
    if (error.code === '23505') {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }
    // Em caso de outro erro, retorna erro 500
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
}

// Deleta um usuário pelo id
export async function deleteUser(req: Request, res: Response) {
  // Converte o parâmetro id para número
  const id = Number(req.params.id);
  // Se não for número, retorna erro 400
  if (isNaN(id)) return res.status(400).json({ error: 'Id Inválido' });

  try {
    // Executa a query de exclusão
    const result = await pool.query('DELETE FROM "User" WHERE id = $1 RETURNING *', [id]);
    // Se não encontrar o usuário, retorna erro 404
    if (result.rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Retorna status 204 (sem conteúdo) em caso de sucesso
    res.status(204).send();
  } catch (error) {
    // Em caso de erro, retorna erro 500
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
}
