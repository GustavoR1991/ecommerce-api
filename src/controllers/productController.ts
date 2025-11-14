
// Importa os tipos Request e Response do Express
import { Request, Response } from "express";
// Importa o pool de conexões com o banco de dados
import pool from "../db"; // ajuste o caminho para seu pool pg

// Lista todos os produtos
export async function listProducts(req: Request, res: Response) {
  try {
    // Executa a query para buscar todos os produtos ordenados por id
    const result = await pool.query('SELECT * FROM "Product" ORDER BY id ASC');
    // Retorna os produtos em formato JSON
    res.json(result.rows);
  } catch {
    // Em caso de erro, retorna erro 500
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Busca um produto pelo id
export async function getProductById(req: Request, res: Response) {
  // Converte o parâmetro id para número
  const id = Number(req.params.id);
  // Se não for número, retorna erro 400
  if (isNaN(id)) return res.status(400).json({ error: "ID Inválido" });

  try {
    // Busca o produto pelo id
    const result = await pool.query('SELECT * FROM "Product" WHERE id = $1', [id]);
    // Se não encontrar, retorna erro 404
    if (result.rows.length === 0) return res.status(404).json({ error: "Produto não encontrado" });
    // Retorna o produto encontrado
    res.json(result.rows[0]);
  } catch {
    // Em caso de erro, retorna erro 500
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// Cria um novo produto
export async function createProduct(req: Request, res: Response) {
  // Extrai os campos do corpo da requisição
  const { name, description, price, stock } = req.body;

  // Valida se todos os campos obrigatórios foram preenchidos
  if (!name || !description || price === undefined || stock === undefined) {
    return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });
  }

  try {
    // Insere o novo produto no banco de dados
    const result = await pool.query(
      `INSERT INTO "Product" (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, price, stock]
    );
    // Retorna o produto criado
    res.json(result.rows[0]);
  } catch {
    // Em caso de erro, retorna erro 500
    res.status(500).json({ error: "Erro ao criar produto" });
  }
}

// Atualiza um produto existente
export async function updateProduct(req: Request, res: Response) {
  // Converte o parâmetro id para número
  const id = Number(req.params.id);
  // Se não for número, retorna erro 400
  if (isNaN(id)) return res.status(400).json({ error: "ID Inválido" });

  // Extrai os campos do corpo da requisição
  const { name, description, price, stock } = req.body;
  // Arrays para montar a query dinamicamente
  const fields = [];
  const values = [];
  let index = 1;

  // Adiciona os campos que foram enviados na requisição
  if (name !== undefined) {
    fields.push(`name = $${index++}`);
    values.push(name);
  }
  if (description !== undefined) {
    fields.push(`description = $${index++}`);
    values.push(description);
  }
  if (price !== undefined) {
    fields.push(`price = $${index++}`);
    values.push(price);
  }
  if (stock !== undefined) {
    fields.push(`stock = $${index++}`);
    values.push(stock);
  }

  // Adiciona o id ao final dos valores
  values.push(id);
  // Monta a query de atualização
  const query = `UPDATE "Product" SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;

  try {
    // Executa a query de atualização
    const result = await pool.query(query, values);
    // Se não encontrar o produto, retorna erro 404
    if (result.rows.length === 0) return res.status(404).json({ error: "Produto não encontrado" });
    // Retorna o produto atualizado
    res.json(result.rows[0]);
  } catch {
    // Em caso de erro, retorna erro 500
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
}

// Deleta um produto pelo id
export async function deleteProduct(req: Request, res: Response) {
  // Converte o parâmetro id para número
  const id = Number(req.params.id);
  // Se não for número, retorna erro 400
  if (isNaN(id)) return res.status(400).json({ error: "ID Inválido" });

  try {
    // Executa a query de exclusão
    const result = await pool.query('DELETE FROM "Product" WHERE id = $1 RETURNING *', [id]);
    // Se não encontrar o produto, retorna erro 404
    if (result.rows.length === 0) return res.status(404).json({ error: "Produto não encontrado" });
    // Retorna status 204 (sem conteúdo) em caso de sucesso
    res.status(204).send();
  } catch {
    // Em caso de erro, retorna erro 500
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
}
