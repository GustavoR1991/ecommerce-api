
// Importa o Router do Express para criar rotas
import { Router } from "express";
// Importa todas as funções do controller de produtos
import * as productController from "../controllers/productController";

// Cria uma instância de router
const router = Router();

// Rota para listar todos os produtos (GET /)
router.get("/", productController.listProducts);
// Rota para buscar um produto pelo id (GET /:id)
router.get("/:id", productController.getProductById);
// Rota para criar um novo produto (POST /)
router.post("/", productController.createProduct);
// Rota para atualizar um produto existente (PUT /:id)
router.put("/:id", productController.updateProduct);
// Rota para deletar um produto (DELETE /:id)
router.delete("/:id", productController.deleteProduct);

// Exporta o router para ser usado no app principal
export default router;
