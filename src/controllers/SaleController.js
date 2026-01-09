
import { Sale } from '../models/Sale.js';
import { Product } from '../models/Product.js';

export class SaleController {
  async getAll(req, res) {
    const sales = await Sale.findAll();
    res.json(sales);
  }

  async create(req, res) {
    const { items } = req.body;
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) return res.status(404).json({ error: `Product ${item.productId} not found` });
      if (product.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}. Available: ${product.quantity}` });
      }
      await product.update({ quantity: product.quantity - item.quantity });
      totalAmount += product.price * item.quantity;
      item.productName = product.name;
      item.price = product.price;
    }
    const sale = await Sale.create({ items, totalAmount });
    res.status(201).json(sale);
  }
}
