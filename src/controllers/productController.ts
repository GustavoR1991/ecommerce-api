import { Request, Response } from "express";
import pool from "../db"; // ajuste o caminho para seu pool pg

export async function listProducts(req: Request, res: Response) {
  try {
    const result = await pool.query('SELECT * FROM "Product" ORDER BY id ASC');
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getProductById(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID Inválido" });

  try {
    const result = await pool.query('SELECT * FROM "Product" WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function createProduct(req: Request, res: Response) {
  const { name, description, price, stock } = req.body;

  if (!name || !description || price === undefined || stock === undefined) {
    return res.status(400).json({ error: "Preencha todos os campos obrigatórios" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO "Product" (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description, price, stock]
    );
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Erro ao criar produto" });
  }
}

export async function updateProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID Inválido" });

  const { name, description, price, stock } = req.body;
  const fields = [];
  const values = [];
  let index = 1;

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

  values.push(id);
  const query = `UPDATE "Product" SET ${fields.join(", ")} WHERE id = $${index} RETURNING *`;

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: "Produto não encontrado" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID Inválido" });

  try {
    const result = await pool.query('DELETE FROM "Product" WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Produto não encontrado" });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
}
