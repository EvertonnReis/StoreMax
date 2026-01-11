import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validateSale } from '../middlewares/validationMiddleware.js';

export function createSaleRoutes(controller, io, products) {
  const router = express.Router();
  
  // Visualizar vendas (requer autenticação)
  router.get('/', authenticate, (req, res) => controller.getAll(req, res));
  
  // Criar venda (requer autenticação)
  router.post('/', authenticate, validateSale, (req, res) => {
    controller.create(req, res);
    io.emit('sale:completed', res.locals.newSale);
    io.emit('inventory:updated', products);
  });
  
  return router;
}
