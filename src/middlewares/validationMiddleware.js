import { body, param, validationResult } from 'express-validator';

// Middleware para verificar erros de validação
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      error: 'Dados inválidos', 
      details: errors.array() 
    });
  }
  next();
};

// Validações para usuário
export const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 3 })
    .withMessage('Nome deve ter pelo menos 3 caracteres'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('E-mail é obrigatório')
    .isEmail()
    .withMessage('E-mail inválido'),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória')
    .isLength({ min: 6 })
    .withMessage('Senha deve ter pelo menos 6 caracteres'),
  validate,
];

export const validateUserLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('E-mail é obrigatório')
    .isEmail()
    .withMessage('E-mail inválido'),
  body('password')
    .notEmpty()
    .withMessage('Senha é obrigatória'),
  validate,
];

// Validações para produto
export const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome do produto é obrigatório')
    .isLength({ min: 3 })
    .withMessage('Nome deve ter pelo menos 3 caracteres'),
  body('price')
    .notEmpty()
    .withMessage('Preço é obrigatório')
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantidade é obrigatória')
    .isInt({ min: 0 })
    .withMessage('Quantidade deve ser um número inteiro positivo'),
  body('description')
    .optional()
    .trim(),
  body('category')
    .optional()
    .trim(),
  validate,
];

export const validateProductUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Nome deve ter pelo menos 3 caracteres'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo'),
  body('quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantidade deve ser um número inteiro positivo'),
  validate,
];

// Validações para categoria
export const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Nome da categoria é obrigatório')
    .isLength({ min: 3 })
    .withMessage('Nome deve ter pelo menos 3 caracteres'),
  body('description')
    .optional()
    .trim(),
  validate,
];

// Validações para venda
export const validateSale = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Itens da venda são obrigatórios'),
  body('items.*.productId')
    .notEmpty()
    .withMessage('ID do produto é obrigatório')
    .isUUID()
    .withMessage('ID do produto deve ser um UUID válido'),
  body('items.*.quantity')
    .notEmpty()
    .withMessage('Quantidade é obrigatória')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número inteiro positivo'),
  validate,
];

// Validação de parâmetro ID (para rotas de produtos)
export const validateId = [
  param('id')
    .isUUID()
    .withMessage('ID inválido'),
  validate,
];

// Validação de parâmetro ID numérico (para outras rotas)
export const validateNumericId = [
  param('id')
    .isInt()
    .withMessage('ID inválido'),
  validate,
];
