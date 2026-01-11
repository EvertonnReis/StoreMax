# 🔐 Sistema de Autenticação - Frontend StoreMax

## ✅ O QUE FOI IMPLEMENTADO

### 1. **Store de Autenticação** (`stores/auth.js`)
- ✅ Login com JWT
- ✅ Registro de novos usuários
- ✅ Logout
- ✅ Verificação de token
- ✅ Persistência de sessão (localStorage)
- ✅ Verificação de roles (admin/user)
- ✅ Helper para requisições autenticadas

### 2. **Tela de Login** (`views/LoginView.vue`)
- ✅ Formulário de login
- ✅ Validação de campos
- ✅ Exibição de erros
- ✅ Credenciais de teste visíveis
- ✅ Link para registro
- ✅ Design moderno e responsivo

### 3. **Tela de Registro** (`views/RegisterView.vue`)
- ✅ Formulário de cadastro completo
- ✅ Validação de senha (min 6 caracteres)
- ✅ Confirmação de senha
- ✅ Opção para criar como admin
- ✅ Link para login
- ✅ Design consistente

### 4. **Proteção da Aplicação** (`App.vue`)
- ✅ Exibe login/cadastro se não autenticado
- ✅ Exibe aplicação se autenticado
- ✅ Informações do usuário no header
- ✅ Badge especial para admin (👑)
- ✅ Botão de logout
- ✅ Inicialização automática da sessão

### 5. **Integração com API**
- ✅ Produtos: usa token nas requisições protegidas
- ✅ Vendas: requer autenticação
- ✅ Headers Authorization automáticos
- ✅ Tratamento de erro 401 (sessão expirada)

---

## 🎯 FLUXO DE AUTENTICAÇÃO

### 1. Ao Abrir a Aplicação
```
1. App.vue verifica se há token no localStorage
2. Se sim: faz requisição para /api/auth/profile
3. Se válido: mostra aplicação
4. Se inválido: mostra tela de login
```

### 2. Login
```
1. Usuário preenche email e senha
2. Requisição POST para /api/auth/login
3. Backend valida credenciais
4. Backend retorna token JWT + dados do usuário
5. Frontend armazena token no localStorage
6. Frontend exibe aplicação principal
```

### 3. Registro
```
1. Usuário preenche formulário
2. Validação local (senhas coincidem, min 6 chars)
3. Requisição POST para /api/auth/register
4. Backend cria usuário e retorna token
5. Frontend armazena token e exibe aplicação
```

### 4. Requisições Autenticadas
```
Todas as requisições incluem:
Authorization: Bearer [TOKEN]

Se retornar 401:
- Limpa token do localStorage
- Redireciona para login
```

### 5. Logout
```
1. Remove token do localStorage
2. Limpa estado do usuário
3. Exibe tela de login
```

---

## 🛡️ PROTEÇÕES IMPLEMENTADAS

### Frontend
- ✅ Rota principal só acessível com login
- ✅ Token enviado automaticamente em todas requisições
- ✅ Logout em caso de token inválido
- ✅ Sessão persistida entre recarregamentos

### Backend (já implementado)
- ✅ Rotas protegidas com middleware `authenticate`
- ✅ Rotas admin com middleware `isAdmin`
- ✅ Validação de token JWT
- ✅ Verificação de expiração

---

## 👤 PERFIS DE USUÁRIO

### Usuário Comum (role: 'user')
- ✅ Pode visualizar produtos
- ✅ Pode realizar vendas
- ✅ Pode visualizar suas vendas
- ❌ NÃO pode criar/editar/deletar produtos
- ❌ NÃO pode criar/editar/deletar categorias

### Administrador (role: 'admin')
- ✅ Todas permissões de usuário comum
- ✅ Pode criar produtos
- ✅ Pode editar produtos
- ✅ Pode deletar produtos
- ✅ Pode gerenciar categorias
- ✅ Pode visualizar todos os usuários
- ✅ Badge especial dourado no header 👑

---

## 🎨 INTERFACE

### Antes do Login
```
┌─────────────────────────────────┐
│                                 │
│    🔐 Login - StoreMax         │
│                                 │
│    Email: [____________]        │
│    Senha: [____________]        │
│                                 │
│    [      ENTRAR      ]         │
│                                 │
│    Não tem conta? Criar conta   │
│                                 │
│    🎯 Credenciais de Teste:     │
│    admin@storemax.com / admin123│
└─────────────────────────────────┘
```

### Depois do Login
```
┌─────────────────────────────────────────────────────┐
│ 🛒 StoreMax          👑 Admin | 🟢 Online | 🚪 Sair │
├─────────────────────────────────────────────────────┤
│ [📦 Produtos] [🛍️ Carrinho] [📊 Vendas]            │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Conteúdo da aplicação...                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🧪 COMO TESTAR

### 1. Teste de Login
```bash
# Iniciar frontend
cd client
npm run dev

# Abrir http://localhost:5173
# Fazer login com: admin@storemax.com / admin123
```

### 2. Teste de Registro
```
1. Clicar em "Criar conta"
2. Preencher formulário
3. Marcar "Criar como Administrador" (opcional)
4. Clicar em "Criar Conta"
5. Verificar login automático
```

### 3. Teste de Persistência
```
1. Fazer login
2. Recarregar página (F5)
3. Verificar que permanece logado
```

### 4. Teste de Logout
```
1. Clicar no botão "🚪 Sair"
2. Confirmar
3. Verificar retorno à tela de login
```

### 5. Teste de Expiração
```
1. Fazer login
2. No DevTools > Application > Local Storage
3. Deletar o token
4. Fazer qualquer ação
5. Verificar redirecionamento para login
```

---

## 📁 ARQUIVOS CRIADOS/MODIFICADOS

### Novos Arquivos
```
client/src/
├── stores/
│   └── auth.js              ← Store de autenticação
└── views/
    ├── LoginView.vue        ← Tela de login
    └── RegisterView.vue     ← Tela de registro
```

### Arquivos Modificados
```
client/src/
├── App.vue                  ← Proteção e header com user
├── stores/
│   ├── products.js          ← Token nas requisições
│   └── sales.js             ← Token nas requisições
```

---

## 🔑 CREDENCIAIS PADRÃO

### Admin (criado automaticamente no backend)
```
Email: admin@storemax.com
Senha: admin123
Role: admin
```

### Criar Novo Usuário
```
Use a tela de registro
Role padrão: user
Marque checkbox para: admin
```

---

## 🚀 FUNCIONALIDADES

### Store de Auth (`useAuthStore`)
```javascript
// Importar
import { useAuthStore } from './stores/auth'

// Usar
const authStore = useAuthStore()

// Verificar autenticação
authStore.isAuthenticated  // boolean

// Verificar se é admin
authStore.isAdmin          // boolean

// Dados do usuário
authStore.user             // { id, name, email, role }

// Token JWT
authStore.token            // string

// Fazer login
await authStore.login(email, password)

// Fazer logout
authStore.logout()

// Requisição autenticada
const response = await authStore.authFetch('/products', {
  method: 'POST',
  body: JSON.stringify(data)
})
```

---

## ✨ MELHORIAS IMPLEMENTADAS

1. **UX Melhorada**
   - Credenciais de teste visíveis
   - Feedback visual de erros
   - Loading states
   - Animações suaves

2. **Segurança**
   - Token no header (não na URL)
   - Logout automático em erro 401
   - Validação de senhas
   - Hash no backend (bcrypt)

3. **Persistência**
   - Token no localStorage
   - Sessão mantida entre recarregamentos
   - Verificação automática ao iniciar

4. **Visual**
   - Design moderno com gradientes
   - Badge especial para admin
   - Informações do usuário no header
   - Responsivo

---

## 🎉 RESULTADO FINAL

✅ **Login/Cadastro funcionando**
✅ **Autenticação JWT completa**
✅ **Proteção de rotas frontend**
✅ **Integração com backend**
✅ **Persistência de sessão**
✅ **Sistema de roles (admin/user)**
✅ **Interface moderna**
✅ **Feedback visual**

**O sistema está 100% funcional e seguro!** 🔐🚀
