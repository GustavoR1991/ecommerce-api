
// Importa o Router do Express para criar rotas
import { Router } from 'express';
// Importa todas as funções do controller de usuários
import * as useController from '../controllers/useController';

// Cria uma instância de router
const router = Router();

// Rota para listar todos os usuários (GET /)
router.get('/', useController.listUsers);
// Rota para buscar um usuário pelo id (GET /:id)

router.get('/:id', useController.getUserById);
// Rota para criar um novo usuário (POST /)
router.post('/', useController.createUser);
// Rota para atualizar um usuário existente (PUT /:id)
router.put('/:id', useController.updateUser);
// Rota para deletar um usuário (DELETE /:id)
router.delete('/:id', useController.deleteUser);
// Rota para login do usuário (POST /login)
router.post('/login', useController.loginUser);

// Exporta o router para ser usado no app principal
export default router;