import express from 'express';
export function createProductRoutes(controller, io) {
  const router = express.Router();
  router.get('/', (req, res) => controller.getAll(req, res));
  router.get('/:id', (req, res) => controller.getById(req, res));
  router.post('/', (req, res) => {
    controller.create(req, res);
    io.emit('product:added', res.locals.newProduct);
  });
  router.put('/:id', (req, res) => {
    controller.update(req, res);
    io.emit('product:updated', res.locals.updatedProduct);
  });
  router.delete('/:id', (req, res) => {
    controller.delete(req, res);
    io.emit('product:deleted', res.locals.deletedProductId);
  });
  return router;
}
