import express from 'express';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';
import { 
  validateUserRegistration, 
  validateUserLogin 
} from '../middlewares/validationMiddleware.js';

export function createAuthRoutes(controller) {
  const router = express.Router();

  // Rotas públicas
  router.post('/register', validateUserRegistration, (req, res) => 
    controller.register(req, res)
  );
  
  router.post('/login', validateUserLogin, (req, res) => 
    controller.login(req, res)
  );

  // Rotas protegidas (requer autenticação)
  router.get('/profile', authenticate, (req, res) => 
    controller.getProfile(req, res)
  );
  
  router.put('/profile', authenticate, (req, res) => 
    controller.updateProfile(req, res)
  );

  // Rota apenas para admin
  router.get('/users', authenticate, isAdmin, (req, res) => 
    controller.getAllUsers(req, res)
  );

  return router;
}
