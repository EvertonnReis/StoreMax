import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export class AuthController {
  // Registro de novo usuário
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      // Verifica se usuário já existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'E-mail já cadastrado' });
      }

      // Cria novo usuário
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'user',
      });

      // Gera token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.status(201).json({
        message: 'Usuário registrado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao registrar usuário', details: error.message });
    }
  }

  // Login de usuário
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Busca usuário pelo e-mail
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Verifica senha
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      // Gera token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
      );

      res.json({
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao realizar login', details: error.message });
    }
  }

  // Obter perfil do usuário autenticado
  async getProfile(req, res) {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar perfil', details: error.message });
    }
  }

  // Atualizar perfil do usuário
  async updateProfile(req, res) {
    try {
      const { name, email } = req.body;
      const user = await User.findByPk(req.user.id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      await user.update({
        name: name || user.name,
        email: email || user.email,
      });

      res.json({
        message: 'Perfil atualizado com sucesso',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar perfil', details: error.message });
    }
  }

  // Listar todos os usuários (apenas admin)
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
      });

      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuários', details: error.message });
    }
  }
}
