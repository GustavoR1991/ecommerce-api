
// Importa o pool de conexões com o banco de dados
import pool from '../db'; // Ajuste o caminho para o seu arquivo db.ts

// Interface que representa um produto
export interface Product {
  id?: number; // id é opcional, pois é gerado pelo banco
  name: string; // nome do produto
  description: string | null; // descrição do produto (pode ser nula)
  price: number; // preço do produto
  stock: number; // quantidade em estoque
}

// Busca todos os produtos no banco de dados
export async function getAllProducts(): Promise<Product[]> {
  const result = await pool.query('SELECT * FROM "Product" ORDER BY id ASC'); // Busca todos os produtos
  return result.rows; // Retorna os produtos encontrados
}

// Busca um produto pelo id
export async function getProductById(productId: number): Promise<Product | null> {
  const result = await pool.query('SELECT * FROM "Product" WHERE id = $1', [productId]); // Busca pelo id
  return result.rows[0] || null; // Retorna o produto ou null se não encontrar
}

// Cria um novo produto
export async function createProduct(product: Product): Promise<Product> {
  const { name, description, price, stock } = product; // Extrai os campos do produto
  const result = await pool.query(
    `INSERT INTO "Product" (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, description, price, stock]
  ); // Insere o produto no banco
  return result.rows[0]; // Retorna o produto criado
}

// Atualiza um produto existente
export async function updateProduct(
  productId: number,
  updates: Partial<Product>
): Promise<Product | null> {
  // Arrays para montar a query dinamicamente
  const fields = [];
  const values = [];
  let index = 1;

  // Adiciona os campos que foram enviados na atualização
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

  // Adiciona o id ao final dos valores
  values.push(productId);

  // Monta a query de atualização
  const query = `UPDATE "Product" SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`;
  // Executa a query de atualização
  const result = await pool.query(query, values);

  return result.rows[0] || null; // Retorna o produto atualizado ou null se não encontrar
}

// Deleta um produto pelo id
export async function deleteProduct(productId: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM "Product" WHERE id = $1 RETURNING *', [productId]); // Deleta o produto
  return (result.rowCount ?? 0) > 0; // Retorna true se deletou, false se não encontrou
}
