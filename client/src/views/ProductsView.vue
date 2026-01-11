<template>
  <div class="products-view">
    <div class="view-header">
      <h2>📦 Gerenciar Produtos</h2>
      <button v-if="authStore.isAdmin" class="btn btn-success" @click="showAddForm = !showAddForm">
        {{ showAddForm ? 'Cancelar' : '➕ Novo Produto' }}
      </button>
    </div>

    <!-- Add/Edit Form -->
    <div v-if="showAddForm" class="form-card">
      <h3>{{ editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto' }}</h3>
      <form @submit.prevent="saveProduct">
        <div class="form-group">
          <label for="name">Nome:</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            placeholder="Nome do produto"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="price">Preço:</label>
            <input
              id="price"
              v-model.number="formData.price"
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div class="form-group">
            <label for="quantity">Quantidade:</label>
            <input
              id="quantity"
              v-model.number="formData.quantity"
              type="number"
              placeholder="0"
              min="0"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="category">Categoria:</label>
          <input
            id="category"
            v-model="formData.category"
            type="text"
            placeholder="Categoria"
            required
          />
        </div>

        <div class="form-group">
          <label for="description">Descrição:</label>
          <textarea
            id="description"
            v-model="formData.description"
            placeholder="Descrição do produto"
            rows="3"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-success">Salvar</button>
          <button type="button" class="btn btn-secondary" @click="resetForm">
            Limpar
          </button>
        </div>
      </form>
    </div>

    <!-- Products Grid -->
    <div class="products-stats">
      <div class="stat-card">
        <div class="stat-value">{{ productStore.products.length }}</div>
        <div class="stat-label">Total de Produtos</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ productStore.availableProducts.length }}</div>
        <div class="stat-label">Produtos Disponíveis</div>
      </div>
      <div class="stat-card warning" v-if="productStore.lowStockProducts.length > 0">
        <div class="stat-value">{{ productStore.lowStockProducts.length }}</div>
        <div class="stat-label">Estoque Baixo</div>
      </div>
    </div>

    <div class="products-grid">
      <div
        v-for="product in productStore.products"
        :key="product.id"
        class="product-card"
        :class="{ 'low-stock': product.quantity < 10 }"
      >
        <div class="product-header">
          <h3>{{ product.name }}</h3>
          <span v-if="product.quantity < 10" class="badge warning">⚠️ Estoque Baixo</span>
          <span v-else-if="product.quantity === 0" class="badge danger">❌ Fora de Estoque</span>
          <span v-else class="badge success">✓ Disponível</span>
        </div>

        <p class="product-description">{{ product.description }}</p>

        <div class="product-info">
          <div class="info-group">
            <span class="label">Categoria:</span>
            <span class="value">{{ product.category }}</span>
          </div>
          <div class="info-group">
            <span class="label">Preço:</span>
            <span class="value price">R$ {{ product.price.toFixed(2) }}</span>
          </div>
          <div class="info-group">
            <span class="label">Estoque:</span>
            <span class="value" :class="{ critical: product.quantity === 0 }">
              {{ product.quantity }} un.
            </span>
          </div>
        </div>

        <div class="product-actions" v-if="authStore.isAdmin">
          <button class="btn btn-small btn-warning" @click="editProduct(product)">
            ✏️ Editar
          </button>
          <button class="btn btn-small btn-danger" @click="deleteProductConfirm(product)">
            🗑️ Deletar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted} from 'vue'
import { useProductStore } from '../stores/products'
import { useAuthStore } from '../stores/auth'

onMounted(() => {
  productStore.fetchProducts()
})

const productStore = useProductStore()
const authStore = useAuthStore()
const showAddForm = ref(false)
const editingProduct = ref(null)
const formData = reactive({
  name: '',
  price: 0,
  quantity: 0,
  category: '',
  description: '',
})

const saveProduct = async () => {
  if (editingProduct.value) {
    await productStore.updateProduct(editingProduct.value.id, formData)
  } else {
    await productStore.addProduct(formData)
  }
  resetForm()
}

const editProduct = (product) => {
  editingProduct.value = product
  formData.name = product.name
  formData.price = product.price
  formData.quantity = product.quantity
  formData.category = product.category
  formData.description = product.description
  showAddForm.value = true
}

const deleteProductConfirm = async (product) => {
  if (confirm(`Tem certeza que deseja deletar "${product.name}"?`)) {
    await productStore.deleteProduct(product.id)
  }
}

const resetForm = () => {
  showAddForm.value = false
  editingProduct.value = null
  formData.name = ''
  formData.price = 0
  formData.quantity = 0
  formData.category = ''
  formData.description = ''
}
</script>

<style scoped>
.products-view {
  background: var(--color-background);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card {
  background: var(--color-muted);
  color: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  padding: 1.5rem;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.card-header {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-surface);
}

.card-content {
  font-size: 1rem;
  color: var(--color-surface);
}

.btn {
  background: var(--color-primary);
  color: var(--color-surface);
  font-size: 1rem;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn:hover {
  background: var(--color-secondary);
}

/* Form Styles */
.form-card {
  background: var(--color-surface);
  border-left: 4px solid var(--color-primary);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.form-card h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

/* Stats */
.products-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-card.warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.product-card {
  background: var(--color-surface);
  border: 1px solid #dee2e6;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  padding: 1.5rem;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.product-card.low-stock {
  border-left: 4px solid #ff9800;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 10px;
}

.product-header h3 {
  margin: 0;
  flex: 1;
  color: #333;
  font-size: 16px;
}

.badge {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.badge.success {
  background: var(--color-success);
  color: var(--color-surface);
}

.badge.warning {
  background: var(--color-warning);
  color: var(--color-surface);
}

.badge.danger {
  background: var(--color-danger);
  color: var(--color-surface);
}

.product-description {
  color: #666;
  font-size: 13px;
  margin: 10px 0;
  flex: 1;
}

.product-info {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-group {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.info-group .label {
  color: #999;
  font-weight: 600;
}

.info-group .value {
  color: #333;
  font-weight: 600;
}

.info-group .value.price {
  color: #667eea;
  font-size: 16px;
}

.info-group .value.critical {
  color: #d32f2f;
}

.product-actions {
  display: flex;
  gap: 10px;
}

/* Button Styles */
.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-success {
  background: #4caf50;
  color: white;
}

.btn-success:hover {
  background: #45a049;
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover {
  background: #da190b;
}

.btn-warning {
  background: #ff9800;
  color: white;
}

.btn-warning:hover {
  background: #e68900;
}

.btn-secondary {
  background: #999;
  color: white;
}

.btn-secondary:hover {
  background: #777;
}

.btn-small {
  padding: 6px 10px;
  font-size: 12px;
  flex: 1;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .view-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .view-header button {
    width: 100%;
  }

  .product-actions {
    flex-direction: column;
  }
}
</style>
