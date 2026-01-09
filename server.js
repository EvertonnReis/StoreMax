
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { ProductController } from './src/controllers/ProductController.js';
import { SaleController } from './src/controllers/SaleController.js';
import { createProductRoutes } from './src/routes/productRoutes.js';
import { createSaleRoutes } from './src/routes/saleRoutes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'client', 'dist')));


// Controllers
const productController = new ProductController();
const saleController = new SaleController();

// Sincroniza models com banco
// Sincroniza models com banco
import { sequelize } from './src/models/db.js';

sequelize.sync().then(async () => {
  // Se não houver produtos, insere exemplos
  const count = await Product.count();
  if (count === 0) {
    await Product.bulkCreate([
      { name: 'Laptop', price: 999.99, quantity: 15, description: 'High-performance laptop', category: 'Electronics' },
      { name: 'Mouse', price: 29.99, quantity: 50, description: 'Wireless mouse', category: 'Accessories' },
      { name: 'Keyboard', price: 79.99, quantity: 30, description: 'Mechanical keyboard', category: 'Accessories' },
      { name: 'Monitor', price: 299.99, quantity: 20, description: '27-inch 4K Monitor', category: 'Electronics' },
      { name: 'USB Cable', price: 9.99, quantity: 100, description: 'USB 3.0 Cable', category: 'Accessories' },
    ]);
    console.log('Produtos de exemplo inseridos no banco.');
  }
});


// Routes
app.use('/api/products', createProductRoutes(productController, io));
app.use('/api/sales', createSaleRoutes(saleController, io));


// ...rotas removidas, agora tudo via controllers e banco...



import { Product } from './src/models/Product.js';
import { Sale } from './src/models/Sale.js';

io.on('connection', async (socket) => {
  console.log('New client connected:', socket.id);
  // Envia produtos e vendas atuais do banco
  const products = await Product.findAll();
  const sales = await Sale.findAll();
  socket.emit('products:init', products);
  socket.emit('sales:init', sales);

  socket.on('product:request-update', async () => {
    const products = await Product.findAll();
    socket.emit('products:update', products);
  });

  socket.on('sales:request-update', async () => {
    const sales = await Sale.findAll();
    socket.emit('sales:update', sales);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});


// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'client', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
