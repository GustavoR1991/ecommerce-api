import pool from '../db'; // Ajuste o caminho para o seu arquivo db.ts

export interface Product {
  id?: number;
  name: string;
  description: string | null;
  price: number; // decimal convertido para number para simplicidade
  stock: number;
}

export async function getAllProducts(): Promise<Product[]> {
  const result = await pool.query('SELECT * FROM "Product" ORDER BY id ASC');
  return result.rows;
}

export async function getProductById(productId: number): Promise<Product | null> {
  const result = await pool.query('SELECT * FROM "Product" WHERE id = $1', [productId]);
  return result.rows[0] || null;
}

export async function createProduct(product: Product): Promise<Product> {
  const { name, description, price, stock } = product;
  const result = await pool.query(
    `INSERT INTO "Product" (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, description, price, stock]
  );
  return result.rows[0];
}

export async function updateProduct(
  productId: number,
  updates: Partial<Product>
): Promise<Product | null> {
  const fields = [];
  const values = [];
  let index = 1;

  if (updates.name !== undefined) {
    fields.push(`name = $${index++}`);
    values.push(updates.name);
  }
  if (updates.description !== undefined) {
    fields.push(`description = $${index++}`);
    values.push(updates.description);
  }
  if (updates.price !== undefined) {
    fields.push(`price = $${index++}`);
    values.push(updates.price);
  }
  if (updates.stock !== undefined) {
    fields.push(`stock = $${index++}`);
    values.push(updates.stock);
  }

  values.push(productId);

  const query = `UPDATE "Product" SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
  const result = await pool.query(query, values);

  return result.rows[0] || null;
}

export async function deleteProduct(productId: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM "Product" WHERE id = $1 RETURNING *', [productId]);
  return (result.rowCount ?? 0) > 0;
}
