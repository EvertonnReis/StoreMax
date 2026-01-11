import { Category } from '../models/Category.js';

export class CategoryController {
  // Listar todas as categorias
  async getAll(req, res) {
    try {
      const categories = await Category.findAll();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar categorias', details: error.message });
    }
  }

  // Buscar categoria por ID
  async getById(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar categoria', details: error.message });
    }
  }

  // Criar nova categoria
  async create(req, res) {
    try {
      const { name, description } = req.body;
      const newCategory = await Category.create({ name, description });
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar categoria', details: error.message });
    }
  }

  // Atualizar categoria
  async update(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      const { name, description } = req.body;
      await category.update({
        name: name || category.name,
        description: description || category.description,
      });

      res.json(category);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar categoria', details: error.message });
    }
  }

  // Deletar categoria
  async delete(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) {
        return res.status(404).json({ error: 'Categoria não encontrada' });
      }

      await category.destroy();
      res.json({ message: 'Categoria deletada com sucesso', id: req.params.id });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar categoria', details: error.message });
    }
  }
}
