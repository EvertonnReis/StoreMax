# 🛒 StoreMax - Sistema de Vendas com API REST

Sistema completo de gerenciamento de vendas com interface Vue.js e API REST Node.js, incluindo autenticação JWT, validação de dados e integração com MySQL.

## 📋 Requisitos do Projeto

Este projeto atende aos seguintes requisitos técnicos:

✅ **Estrutura e Funcionalidades**
- Mínimo de 10 endpoints funcionais
- Controllers organizados por responsabilidade
- Middleware de autenticação (JWT)
- Middleware de validação de dados
- Autenticação com JSON Web Token

✅ **Banco de Dados**
- Sequelize com MySQL
- Models: User, Product, Sale, Category

✅ **Design**
- Interface Vue.js baseada em design Figma
- Sistema de vendas com gerenciamento de produtos e carrinho

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** + **Express**
- **Sequelize** (ORM)
- **MySQL** (Banco de dados)
- **JWT** (Autenticação)
- **Bcrypt** (Criptografia de senhas)
- **Express Validator** (Validação de dados)
- **Socket.io** (Comunicação em tempo real)

### Frontend
- **Vue 3** (Composition API)
- **Vite** (Build tool)

### DevOps
- **Docker** + **Docker Compose**

---

## 📁 Estrutura do Projeto

```
StoreMax/
├── src/
│   ├── controllers/
│   │   ├── AuthController.js        # Autenticação e usuários
│   │   ├── ProductController.js     # Gerenciamento de produtos
│   │   ├── SaleController.js        # Registro de vendas
│   │   └── CategoryController.js    # Gerenciamento de categorias
│   ├── models/
│   │   ├── User.js                  # Model de usuário
│   │   ├── Product.js               # Model de produto
│   │   ├── Sale.js                  # Model de venda
│   │   ├── Category.js              # Model de categoria
│   │   └── db.js                    # Configuração Sequelize
│   ├── routes/
│   │   ├── authRoutes.js            # Rotas de autenticação
│   │   ├── productRoutes.js         # Rotas de produtos
│   │   ├── saleRoutes.js            # Rotas de vendas
│   │   └── categoryRoutes.js        # Rotas de categorias
│   ├── middlewares/
│   │   ├── authMiddleware.js        # Verificação JWT
│   │   └── validationMiddleware.js  # Validação de dados
│   └── services/
├── client/                          # Frontend Vue.js
├── server.js                        # Servidor principal
├── docker-compose.yml               # Configuração Docker
└── package.json

```

---

## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/EvertonnReis/StoreMax/
cd StoreMax
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=rootpassword
DB_NAME=storemax
DB_PORT=3306
JWT_SECRET=sua_chave_secreta_super_segura
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Inicie o banco de dados com Docker

```bash
docker-compose up -d
```

### 4. Instale as dependências

```bash
# Backend
npm install

# Frontend
cd client
npm install
cd ..
```

### 5. Inicie o servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Ou apenas o servidor
npm run dev:server
```

O servidor estará rodando em `http://localhost:3000`
O frontend em `http://localhost:5173`

---

## 📡 API Endpoints

### 🔐 Autenticação (`/api/auth`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/auth/register` | Registrar novo usuário | ❌ |
| POST | `/api/auth/login` | Login de usuário | ❌ |
| GET | `/api/auth/profile` | Obter perfil do usuário | ✅ |
| PUT | `/api/auth/profile` | Atualizar perfil | ✅ |
| GET | `/api/auth/users` | Listar todos usuários (admin) | ✅ 👑 |

### 📦 Produtos (`/api/products`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/products` | Listar todos produtos | ❌ |
| GET | `/api/products/:id` | Buscar produto por ID | ❌ |
| POST | `/api/products` | Criar novo produto | ✅ 👑 |
| PUT | `/api/products/:id` | Atualizar produto | ✅ 👑 |
| DELETE | `/api/products/:id` | Deletar produto | ✅ 👑 |

### 🛍️ Vendas (`/api/sales`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/sales` | Listar todas vendas | ✅ |
| POST | `/api/sales` | Registrar nova venda | ✅ |

### 🏷️ Categorias (`/api/categories`)

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| GET | `/api/categories` | Listar todas categorias | ❌ |
| GET | `/api/categories/:id` | Buscar categoria por ID | ❌ |
| POST | `/api/categories` | Criar nova categoria | ✅ 👑 |
| PUT | `/api/categories/:id` | Atualizar categoria | ✅ 👑 |
| DELETE | `/api/categories/:id` | Deletar categoria | ✅ 👑 |

**Legenda:**
- ✅ = Requer autenticação (Bearer Token)
- 👑 = Requer privilégios de admin
- ❌ = Rota pública

**Total de Endpoints: 15** ✅

---

## 🧪 Testando a API

### Credenciais Padrão

Ao iniciar o sistema pela primeira vez, um usuário admin é criado automaticamente:

```
Email: admin@storemax.com
Senha: admin123
```

### Exemplo de Requisições

#### 1. Registrar Novo Usuário

```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123",
  "role": "user"
}
```

#### 2. Login

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@storemax.com",
  "password": "admin123"
}
```

**Resposta:**
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "name": "Administrador",
    "email": "admin@storemax.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 3. Criar Produto (Requer Token Admin)

```bash
POST http://localhost:3000/api/products
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "name": "Notebook Dell",
  "price": 3500.00,
  "quantity": 10,
  "description": "Notebook Dell Inspiron 15",
  "category": "Electronics"
}
```

#### 4. Listar Produtos

```bash
GET http://localhost:3000/api/products
```

#### 5. Registrar Venda (Requer Token)

```bash
POST http://localhost:3000/api/sales
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ]
}
```

#### 6. Criar Categoria (Requer Token Admin)

```bash
POST http://localhost:3000/api/categories
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json

{
  "name": "Hardware",
  "description": "Componentes de hardware"
}
```

---

## 🛡️ Middlewares

### 1. Middleware de Autenticação (`authMiddleware.js`)

- Verifica presença e validade do token JWT
- Adiciona informações do usuário ao `req.user`
- Middleware `isAdmin` para verificar privilégios de administrador

### 2. Middleware de Validação (`validationMiddleware.js`)

Validações implementadas:
- **Usuário**: nome (min 3 chars), email válido, senha (min 6 chars)
- **Produto**: nome, preço positivo, quantidade inteira
- **Categoria**: nome (min 3 chars)
- **Venda**: array de itens com productId e quantity válidos
- **ID**: validação de parâmetros numéricos

---

## 📊 Models e Banco de Dados

### User
```javascript
{
  id: INTEGER (PK),
  name: STRING,
  email: STRING (UNIQUE),
  password: STRING (HASHED),
  role: ENUM('admin', 'user'),
  createdAt: DATE,
  updatedAt: DATE
}
```

### Product
```javascript
{
  id: INTEGER (PK),
  name: STRING,
  price: DECIMAL,
  quantity: INTEGER,
  description: TEXT,
  category: STRING,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Sale
```javascript
{
  id: INTEGER (PK),
  items: JSON,
  totalAmount: DECIMAL,
  createdAt: DATE,
  updatedAt: DATE
}
```

### Category
```javascript
{
  id: INTEGER (PK),
  name: STRING (UNIQUE),
  description: TEXT,
  createdAt: DATE,
  updatedAt: DATE
}
```

---

## 🎨 Design Figma

O design do sistema foi baseado em um protótipo Figma de sistema de vendas.

**Link do Design:** [Inserir link do seu Figma aqui]

---

## 🎥 Vídeo Demonstração

[Inserir link do vídeo demonstrativo aqui - máximo 5 minutos]

O vídeo demonstra:
- Funcionamento da API
- Principais rotas/endpoints em execução
- Testes via Insomnia/Postman
- Integração com banco de dados
- Sistema de autenticação JWT

---

## 📝 Scripts Disponíveis

```bash
npm run dev              # Inicia servidor e frontend em modo dev
npm run dev:server       # Inicia apenas o servidor com hot reload
npm run dev:frontend     # Inicia apenas o frontend
npm start                # Inicia servidor em modo produção
npm run build            # Build do frontend
```

---

## 🔒 Segurança

- Senhas criptografadas com **bcrypt**
- Autenticação via **JWT**
- Middlewares de validação de dados
- Proteção de rotas sensíveis
- Validação de privilégios (admin/user)

---

## 🐳 Docker

O projeto inclui configuração Docker para MySQL:

```bash
# Iniciar banco de dados
docker-compose up -d

# Parar banco de dados
docker-compose down

# Ver logs
docker-compose logs -f
```

---

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

## 📄 Licença

MIT

---

## ✅ Checklist de Entrega

- [x] API REST funcional com mínimo 10 endpoints (15 endpoints implementados)
- [x] Controllers organizados por responsabilidade (4 controllers)
- [x] Middleware de autenticação (JWT)
- [x] Middleware de validação de dados
- [x] Integração com banco de dados (Sequelize + MySQL)
- [x] README com instruções completas

---

**Desenvolvido para a disciplina de Desenvolvimento de APIs REST**
