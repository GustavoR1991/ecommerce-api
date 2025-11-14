
// Importa o framework Express para criar o servidor HTTP
import express from 'express';
// Importa o middleware CORS para permitir requisições de outros domínios
import cors from 'cors';
// Importa as rotas de usuários
import userRoutes from './routes/userRoutes';
// Importa as rotas de produtos
import productRoutes from './routes/productRoutes';

// Cria uma instância da aplicação Express
const app = express();

// Aplica o middleware CORS para todas as rotas
app.use(cors());
// Permite que a aplicação receba e entenda JSON no corpo das requisições
app.use(express.json());

// Usa as rotas de usuários no caminho /api/users
app.use('/api/users', userRoutes);
// Usa as rotas de produtos no caminho /api/products
app.use('/api/products', productRoutes);


// Exporta a aplicação para ser usada em outros arquivos (ex: server.ts)
export default app;