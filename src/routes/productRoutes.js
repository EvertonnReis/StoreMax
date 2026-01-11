import express from 'express';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';
import { 
  validateProduct, 
  validateProductUpdate, 
  validateId 
} from '../middlewares/validationMiddleware.js';

export function createProductRoutes(controller, io) {
  const router = express.Router();
  
  // Rotas públicas (visualização)
  router.get('/', (req, res) => controller.getAll(req, res));
  router.get('/:id', validateId, (req, res) => controller.getById(req, res));
  
  // Rotas protegidas (apenas admin)
  router.post('/', authenticate, isAdmin, validateProduct, (req, res) => {
    controller.create(req, res);
    io.emit('product:added', res.locals.newProduct);
  });
  
  router.put('/:id', authenticate, isAdmin, validateId, validateProductUpdate, (req, res) => {
    controller.update(req, res);
    io.emit('product:updated', res.locals.updatedProduct);
  });
  
  router.delete('/:id', authenticate, isAdmin, validateId, (req, res) => {
    controller.delete(req, res);
    io.emit('product:deleted', res.locals.deletedProductId);
  });
  
  return router;
}
