
// Importa o Pool do pacote pg para conectar ao PostgreSQL
import { Pool } from 'pg';
// Importa o dotenv para carregar variáveis de ambiente do arquivo .env
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Cria uma instância de Pool para gerenciar as conexões com o banco de dados
const pool = new Pool({
  host: process.env.DB_HOST, // Endereço do banco de dados
  port: Number(process.env.DB_PORT), // Porta do banco de dados
  user: process.env.DB_USER, // Usuário do banco de dados
  password: process.env.DB_PASS, // Senha do banco de dados
  database: process.env.DB_NAME, // Nome do banco de dados
})

// Exporta o pool para ser usado nas consultas ao banco de dados
export default pool;