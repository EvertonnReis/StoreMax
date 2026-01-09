# 🛒 StoreMax - Sistema de Vendas em Tempo Real

Um sistema moderno de gerenciamento de vendas e estoque em tempo real, construído com **Node.js**, **Express**, **Vue 3**, **Pinia** e **WebSockets**.

## ✨ Características

- **🔄 Atualizações em Tempo Real** - WebSocket integration para sincronização instantânea
- **📦 Gerenciamento de Estoque** - Controle de estoque em tempo real com alertas de estoque baixo
- **🛍️ Carrinho de Compras Interativo** - Adicionar/remover produtos com atualização automática
- **💰 Relatório de Vendas** - Dashboard com estatísticas de vendas do dia
- **🎨 Interface Moderna** - Design responsivo com Tailwind-like CSS
- **⚡ Performance Otimizada** - Vite para desenvolvimento rápido e builds otimizados

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Socket.io** - WebSocket em tempo real
- **CORS** - Controle de acesso cross-origin
- **UUID** - Geração de IDs únicos

### Frontend
- **Vue 3** - Framework progressivo
- **Pinia** - State management moderno
- **Vite** - Build tool ultrarrápido
- **Socket.io-client** - Cliente WebSocket
- **Axios** - HTTP client

## 📋 Requisitos

- Node.js 16+ 
- npm ou yarn

## 🔧 Instalação

### 1. Instalar dependências do servidor
```bash
npm install
```

### 2. Instalar dependências do cliente
```bash
cd client
npm install
cd ..
```

## 🎯 Como Executar

### Modo Desenvolvimento (ambos servidor e frontend)
```bash
npm run dev
```

Isso irá:
- Iniciar o servidor Node.js na porta **3000**
- Iniciar o Vite dev server na porta **5173**

### Ou separadamente:

**Terminal 1 - Servidor:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

## 🌐 Acesso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api

## 📖 Estrutura do Projeto

```
storemax/
├── server.js                 # Servidor Express principal
├── package.json             # Dependências do servidor
├── client/                  # Frontend Vue 3
│   ├── src/
│   │   ├── main.js         # Entry point Vue
│   │   ├── App.vue         # Componente raiz
│   │   ├── stores/         # Pinia stores
│   │   │   ├── products.js # Store de produtos
│   │   │   └── sales.js    # Store de vendas
│   │   ├── views/          # Componentes de página
│   │   │   ├── ProductsView.vue  # Gerenciamento de produtos
│   │   │   ├── CheckoutView.vue  # Carrinho e checkout
│   │   │   └── SalesView.vue     # Histórico de vendas
│   │   └── styles/         # Estilos globais
│   ├── index.html          # HTML template
│   ├── package.json        # Dependências do frontend
│   └── vite.config.js      # Configuração Vite
```

## 🔌 Endpoints da API

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/:id` - Obter produto específico
- `POST /api/products` - Criar novo produto
- `PUT /api/products/:id` - Atualizar produto
- `DELETE /api/products/:id` - Deletar produto

### Vendas
- `GET /api/sales` - Listar todas as vendas
- `POST /api/sales` - Completar venda

## 🔌 Eventos WebSocket

### Cliente recebe
- `products:init` - Inicialização dos produtos
- `products:update` - Atualização de produtos
- `product:added` - Novo produto adicionado
- `product:updated` - Produto atualizado
- `product:deleted` - Produto deletado
- `inventory:updated` - Estoque atualizado
- `sale:completed` - Venda completada

### Cliente envia
- `product:request-update` - Solicita atualização de produtos
- `sales:request-update` - Solicita atualização de vendas

## 💾 Dados de Exemplo

O servidor inicia com alguns produtos pré-carregados:
- Laptop - R$ 999.99 (15 unidades)
- Mouse - R$ 29.99 (50 unidades)
- Keyboard - R$ 79.99 (30 unidades)
- Monitor - R$ 299.99 (20 unidades)
- USB Cable - R$ 9.99 (100 unidades)

## 🎨 Funcionalidades do Frontend

### 📦 Aba Produtos
- Visualizar todos os produtos
- Criar novo produto
- Editar produto existente
- Deletar produto
- Ver alertas de estoque baixo
- Estatísticas em tempo real

### 🛍️ Aba Carrinho
- Adicionar produtos ao carrinho
- Ajustar quantidade de itens
- Remover itens do carrinho
- Buscar produtos por nome/categoria
- Visualizar total do carrinho
- Confirmar venda

### 📊 Aba Vendas
- Dashboard com estatísticas do dia
- Histórico de vendas filtrado por data
- Detalhes expandíveis de cada venda
- Ordenação por data ou valor
- Resumo de itens vendidos

## ⚙️ Configuração

### Porta do Servidor
Editar em `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

### CORS
Configurado para `http://localhost:5173`. Para produção, atualizar em `server.js`:
```javascript
cors: {
  origin: 'seu-dominio.com',
  methods: ['GET', 'POST'],
},
```

## 🚀 Build para Produção

```bash
npm run build
```

Isso irá:
1. Build do frontend Vue com Vite
2. Saída em `client/dist`

Para servir em produção:
```bash
NODE_ENV=production npm start
```

## 📝 Notas

- Os dados são armazenados em memória. Para persistência, integre com um banco de dados como SQLite, PostgreSQL ou MongoDB
- Socket.io sincroniza automaticamente entre clientes
- O sistema suporta múltiplos clientes simultâneos

## 🔐 Segurança (Melhorias Futuras)

- Adicionar autenticação JWT
- Validação de dados em servidor
- Rate limiting
- Helmet.js para headers de segurança
- Logging e auditoria

## 📦 Próximas Melhorias

- [ ] Integração com banco de dados (Prisma + SQLite/PostgreSQL)
- [ ] Autenticação e autorização
- [ ] Filtragem avançada de vendas
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Gráficos de vendas
- [ ] Sistema de usuários/caixas
- [ ] Backup automático
- [ ] Notificações push

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ em Node.js, Express e Vue 3**
