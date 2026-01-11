import express from 'express';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';
import { 
  validateCategory, 
  validateNumericId 
} from '../middlewares/validationMiddleware.js';

export function createCategoryRoutes(controller) {
  const router = express.Router();

  // Rotas públicas
  router.get('/', (req, res) => controller.getAll(req, res));
  router.get('/:id', validateNumericId, (req, res) => controller.getById(req, res));

  // Rotas protegidas (apenas admin)
  router.post('/', authenticate, isAdmin, validateCategory, (req, res) => 
    controller.create(req, res)
  );
  
router.put('/:id', authenticate, isAdmin, validateNumericId, (req, res) => 
    controller.update(req, res)
  );
  
router.delete('/:id', authenticate, isAdmin, validateNumericId, (req, res) => 
    controller.delete(req, res)
  );

  return router;
}
