# 🗄️ Como Conectar o Banco no DBeaver

## 📋 Informações de Conexão

Baseado no seu `docker-compose.yml`, use estas configurações:

### Dados de Conexão
```
Host: localhost
Port: 3306
Database: storemax
Username: root
Password: root123
```

**OU** você pode usar o usuário específico:
```
Username: storemax
Password: storemax123
```

---

## 🚀 Passo a Passo no DBeaver

### 1. **Certifique-se que o Docker está rodando**
```bash
docker ps
```
Você deve ver o container `storemax-mysql` rodando.

---

### 2. **Abrir DBeaver**
- Abra o DBeaver

---

### 3. **Criar Nova Conexão**
1. Clique em **"Database"** no menu superior
2. Selecione **"New Database Connection"**
3. Ou clique no ícone de **"plug"** (Nova Conexão)

---

### 4. **Selecionar MySQL**
1. Na janela que abrir, procure por **"MySQL"**
2. Clique em **MySQL** (ícone de golfinho)
3. Clique em **"Next"** (Próximo)

---

### 5. **Configurar Conexão**

Preencha os campos:

```
┌─────────────────────────────────────┐
│ Server Host:  localhost             │
│ Port:         3306                  │
│ Database:     storemax              │
│ Username:     root                  │
│ Password:     root123               │
│                                     │
│ ☑ Save password                     │
└─────────────────────────────────────┘
```

**Detalhes:**
- **Server Host**: `localhost`
- **Port**: `3306`
- **Database**: `storemax`
- **Username**: `root`
- **Password**: `root123`
- **Marque**: "Save password" (Salvar senha)

### 5.1 **IMPORTANTE: Configurar Driver Properties**

Antes de testar, você precisa adicionar uma propriedade:

1. Na mesma janela de conexão, procure a aba **"Driver properties"** (Propriedades do Driver)
2. Clique na aba **"Driver properties"**
3. Procure por `allowPublicKeyRetrieval` (use Ctrl+F para buscar)
4. **Altere o valor para `true`** (dê duplo clique ou clique em Edit)
5. Se não encontrar, clique em **"Add Property"** e adicione:
   - **Name**: `allowPublicKeyRetrieval`
   - **Value**: `true`

**OU simplesmente:**
1. Vá para a aba **"Driver properties"**
2. Procure e configure estas propriedades:
   - `allowPublicKeyRetrieval` = `true`
   - `useSSL` = `false` (opcional, mas recomendado para desenvolvimento local)

---

### 6. **Testar Conexão**
1. Clique em **"Test Connection"** (Testar Conexão)
2. Se for a primeira vez, o DBeaver pode pedir para baixar o driver MySQL
   - Clique em **"Download"** ou **"OK"**
   - Aguarde o download terminar

3. Você deve ver a mensagem: ✅ **"Connected"**

---

### 7. **Finalizar**
1. Clique em **"Finish"** (Finalizar)
2. A conexão aparecerá na aba **"Database Navigator"** à esquerda

---

## 📊 Explorando o Banco

### 1. **Expandir a Conexão**
```
localhost
└── storemax
    ├── Tables
    │   ├── Categories
    │   ├── Products
    │   ├── Sales
    │   └── Users
    └── ...
```

### 2. **Ver Dados de uma Tabela**
1. Clique com botão direito na tabela (ex: `Products`)
2. Selecione **"View Data"** ou **"Data"**
3. Os dados serão exibidos

### 3. **Executar SQL**
1. Clique com botão direito na conexão
2. Selecione **"SQL Editor"** > **"New SQL Script"**
3. Digite seu SQL e execute (Ctrl+Enter ou F5)

---

## 🔍 Consultas Úteis

### Ver todos os produtos
```sql
SELECT * FROM Products;
```

### Ver todas as vendas
```sql
SELECT * FROM Sales;
```

### Ver todos os usuários (senhas hasheadas)
```sql
SELECT id, name, email, role, createdAt FROM Users;
```

### Ver categorias
```sql
SELECT * FROM Categories;
```

### Total de vendas
```sql
SELECT COUNT(*) as total_vendas, SUM(totalAmount) as receita_total 
FROM Sales;
```

---

## ⚠️ Problemas Comuns

### ❌ "Can't connect to MySQL server"
**Solução:**
1. Verifique se o Docker está rodando:
   ```bash
   docker ps
   ```
2. Se não estiver, inicie:
   ```bash
   docker-compose up -d
   ```

### ❌ "Access denied for user 'root'"
**Solução:**
- Verifique se a senha está correta: `root123`
- Ou tente com o usuário: `storemax` / `storemax123`

### ❌ "Unknown database 'storemax'"
**Solução:**
1. O banco pode não ter sido criado
2. Conecte sem especificar o database (deixe em branco)
3. Execute:
   ```sql
   CREATE DATABASE storemax;
   ```

### ❌ Driver não instalado
**Solução:**
- Quando pedir, clique em "Download" para baixar o driver MySQL
- Aguarde o download completar
- Tente testar novamente

### ❌ "Public Key Retrieval is not allowed"
**Solução (MAIS COMUM NO MYSQL 8.0+):**
1. Na configuração da conexão, vá para a aba **"Driver properties"**
2. Encontre ou adicione a propriedade: `allowPublicKeyRetrieval`
3. Altere o valor para: `true`
4. Clique em "Apply" e teste novamente

**Passo a passo detalhado:**
1. Clique com botão direito na conexão
2. Selecione **"Edit Connection"**
3. Vá para a aba **"Driver properties"**
4. Role até encontrar `allowPublicKeyRetrieval` (ou use Ctrl+F)
5. Dê duplo clique no valor e mude para `true`
6. Clique em **"OK"** ou **"Apply"**
7. Teste a conexão novamente

**OU adicione na URL da conexão:**
Na aba "Main", em "JDBC URL", adicione ao final:
```
?allowPublicKeyRetrieval=true&useSSL=false
```
A URL ficará assim:
```
jdbc:mysql://localhost:3306/storemax?allowPublicKeyRetrieval=true&useSSL=false
```

---

## 🎯 Exemplo de Configuração Visual

```
┌───────────────────────────────────────────────┐
│  MySQL Connection Settings                    │
├───────────────────────────────────────────────┤
│                                               │
│  Connection name:  StoreMax MySQL             │
│                                               │
│  Main:                                        │
│  ┌─────────────────────────────────────────┐ │
│  │ Host:        localhost                  │ │
│  │ Port:        3306                       │ │
│  │ Database:    storemax                   │ │
│  │ Username:    root                       │ │
│  │ Password:    ••••••••                   │ │
│  │ ☑ Save password                         │ │
│  └─────────────────────────────────────────┘ │
│                                               │
│  [Test Connection]  [Finish]  [Cancel]        │
└───────────────────────────────────────────────┘
```

---

## 📝 Resumo Rápido

1. **Abrir DBeaver**
2. **Nova Conexão** → MySQL
3. **Configurar:**
   - Host: `localhost`
   - Port: `3306`
   - Database: `storemax`
   - User: `root`
   - Password: `root123`
4. **Test Connection**
5. **Finish**
6. **Explorar tabelas!**

---

## 🎉 Pronto!

Agora você pode:
- ✅ Ver todas as tabelas
- ✅ Consultar dados
- ✅ Executar SQL personalizado
- ✅ Visualizar estrutura do banco
- ✅ Editar dados (com cuidado!)

**Importante:** As senhas dos usuários estão hasheadas (bcrypt), então você não verá a senha real no banco.
