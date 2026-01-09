import express from 'express';
export function createSaleRoutes(controller, io, products) {
  const router = express.Router();
  router.get('/', (req, res) => controller.getAll(req, res));
  router.post('/', (req, res) => {
    controller.create(req, res);
    io.emit('sale:completed', res.locals.newSale);
    io.emit('inventory:updated', products);
  });
  return router;
}
