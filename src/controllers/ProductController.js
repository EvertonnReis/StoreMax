
import { Product } from '../models/Product.js';

export class ProductController {
  async getAll(req, res) {
    const products = await Product.findAll();
    res.json(products);
  }

  async getById(req, res) {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  }

  async create(req, res) {
    const { name, price, quantity, description, category } = req.body;
    const newProduct = await Product.create({ name, price, quantity, description, category });
    res.status(201).json(newProduct);
  }

  async update(req, res) {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const { name, price, quantity, description, category } = req.body;
    await product.update({
      name: name || product.name,
      price: price || product.price,
      quantity: quantity ?? product.quantity,
      description: description || product.description,
      category: category || product.category,
    });
    res.json(product);
  }

  async delete(req, res) {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.json({ id: req.params.id });
  }
}
