<template>
  <div class="checkout-view">
    <div class="checkout-container">
      <!-- Cart Items -->
      <div class="cart-section">
        <h2>🛍️ Carrinho de Compras</h2>

        <div v-if="cartStore.cart.length === 0" class="empty-cart">
          <p>Seu carrinho está vazio</p>
          <p class="small-text">Selecione produtos para começar uma venda</p>
        </div>

        <div v-else>
          <div class="cart-items">
            <div v-for="item in cartStore.cart" :key="item.productId" class="cart-item">
              <div class="item-info">
                <h3>{{ item.productName }}</h3>
                <p class="item-price">R$ {{ item.price.toFixed(2) }}</p>
              </div>

              <div class="item-quantity">
                <button @click="decreaseQuantity(item.productId)" class="qty-btn">−</button>
                <input
                  v-model.number="item.quantity"
                  type="number"
                  min="1"
                  @change="cartStore.updateCartQuantity(item.productId, item.quantity)"
                  class="qty-input"
                />
                <button @click="increaseQuantity(item.productId)" class="qty-btn">+</button>
              </div>

              <div class="item-total">
                <span>{{ (item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</span>
              </div>

              <button @click="cartStore.removeFromCart(item.productId)" class="btn-remove">
                🗑️
              </button>
            </div>
          </div>

          <div class="cart-summary">
            <div class="summary-row">
              <span>Subtotal:</span>
              <span>{{ cartStore.cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</span>
            </div>
            <div class="summary-row">
              <span>Total de Itens:</span>
              <span>{{ totalItems }}</span>
            </div>
            <div class="summary-row total">
              <span>TOTAL:</span>
              <span>{{ cartStore.cartTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</span>
            </div>
          </div>

          <div class="cart-actions">
            <button @click="cartStore.clearCart()" class="btn btn-secondary btn-large">
              Limpar Carrinho
            </button>
            <button @click="completeSale" class="btn btn-success btn-large" :disabled="isProcessing">
              {{ isProcessing ? '⏳ Processando...' : '✓ Confirmar Venda' }}
            </button>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>
          <div v-if="success" class="success-message">
            ✓ Venda realizada com sucesso!
          </div>
        </div>
      </div>

      <!-- Product Selector -->
      <div class="products-selector">
        <h2>📦 Selecionar Produtos</h2>

        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="🔍 Buscar produto..."
            class="search-input"
          />
        </div>

        <div class="available-products">
          <div
            v-for="product in filteredAvailableProducts"
            :key="product.id"
            class="product-item"
            :class="{ 'low-stock': product.quantity < 5 }"
          >
            <div class="product-name">{{ product.name }}</div>
            <div class="product-details">
              <span class="price">R$ {{ product.price.toFixed(2) }}</span>
              <span class="stock">Est: {{ product.quantity }}</span>
            </div>
            <button
              @click="addToCart(product)"
              class="btn btn-success"
              :disabled="product.quantity === 0"
            >
              Adicionar
            </button>
          </div>

          <div v-if="filteredAvailableProducts.length === 0" class="no-products">
            Nenhum produto disponível
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '../stores/products'
import { useSalesStore } from '../stores/sales'

const productStore = useProductStore()
const cartStore = useSalesStore()
const searchQuery = ref('')
const isProcessing = ref(false)
const error = ref('')
const success = ref('')

const addToCart = (product) => {
  cartStore.addToCart(product, 1)
  error.value = ''
}

const increaseQuantity = (productId) => {
  const item = cartStore.cart.find((i) => i.productId === productId)
  if (item) {
    cartStore.updateCartQuantity(productId, item.quantity + 1)
  }
}

const decreaseQuantity = (productId) => {
  const item = cartStore.cart.find((i) => i.productId === productId)
  if (item && item.quantity > 1) {
    cartStore.updateCartQuantity(productId, item.quantity - 1)
  }
}

const completeSale = async () => {
  if (cartStore.cart.length === 0) {
    error.value = 'Carrinho vazio'
    return
  }

  isProcessing.value = true
  error.value = ''
  success.value = ''

  try {
    await cartStore.completeSale(cartStore.cart)
    success.value = true
    cartStore.clearCart()
    setTimeout(() => {
      success.value = ''
    }, 3000)
  } catch (err) {
    error.value = err.response?.data?.error || 'Erro ao processar venda'
  } finally {
    isProcessing.value = false
  }
}

const filteredAvailableProducts = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return productStore.availableProducts.filter((p) =>
    p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
  )
})

const totalItems = computed(() => {
  return cartStore.cart.reduce((total, item) => total + item.quantity, 0)
})
</script>

<style scoped>
.checkout-view {
  background: var(--color-background);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.checkout-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  width: 100%;
}

.cart-section {
  background: var(white);
  color: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.cart-section h2,
.products-selector h2 {
  margin: 0;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
}

.empty-cart {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-cart p {
  margin: 10px 0;
}

.empty-cart .small-text {
  font-size: 13px;
}

/* Cart Items */
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.cart-item {
  background: var(--color-surface);
  border: 1px solid #dee2e6;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  padding: 1.5rem;
}

.cart-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.item-info h3 {
  margin: 0;
  font-size: 14px;
  color: #333;
}

.item-price {
  margin: 4px 0 0 0;
  color: #667eea;
  font-size: 14px;
  font-weight: 600;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 4px;
}

.qty-btn {
  background: white;
  border: 1px solid #ddd;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  color: #667eea;
  transition: all 0.2s;
}

.qty-btn:hover {
  background: #667eea;
  color: white;
}

.qty-input {
  width: 50px;
  text-align: center;
  border: 1px solid #ddd;
  padding: 6px;
  border-radius: 4px;
  font-weight: 600;
}

.item-total {
  text-align: right;
  font-weight: 600;
  color: #333;
}

.btn-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s;
}

.btn-remove:hover {
  transform: scale(1.2);
}

/* Cart Summary */
.cart-summary {
  background: var(--color-secondary);
  opacity: 1.0;
  color: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-top: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #000000;
  font-size: 14px;
}

.summary-row.total {
  border-bottom: none;
  border-top: 2px solid #f0f0f0;
  padding-top: 15px;
  font-size: 18px;
  font-weight: bold;
  color: rgb(0, 0, 0);
}

/* Cart Actions */
.cart-actions {
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.btn-large {
  padding: 14px 20px;
  font-size: 16px;
}

.error-message {
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  padding: 12px;
  border-radius: 6px;
  margin-top: 10px;
  text-align: center;
}

.success-message {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 12px;
  border-radius: 6px;
  margin-top: 10px;
  text-align: center;
  font-weight: 600;
}

/* Product Selector */
.search-box {
  margin-bottom: 15px;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.available-products {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 500px;
  overflow-y: auto;
}

.product-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  align-items: center;
  padding: 12px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  transition: all 0.3s;
}

.product-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.product-item.low-stock {
  background: #fffbea;
  border-left: 3px solid #ff9800;
}

.product-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.product-details {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.price {
  color: #667eea;
  font-weight: 600;
  font-size: 14px;
}

.stock {
  color: #999;
  font-size: 13px;
}

.btn-add {
  padding: 8px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  font-size: 12px;
  transition: all 0.3s;
}

.btn-add:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
}

.btn-add:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.no-products {
  text-align: center;
  color: #999;
  padding: 40px 20px;
}

/* Buttons */
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

.btn-success {
  background: #4caf50;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.btn-success:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #999;
  color: white;
}

.btn-secondary:hover {
  background: #777;
}

@media (max-width: 1024px) {
  .checkout-container {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .item-quantity,
  .product-details {
    order: -1;
  }
}

@media (max-width: 768px) {
  .checkout-view {
    flex-direction: column;
  }

  .available-products {
    max-height: 300px;
  }

  .cart-item {
    grid-template-columns: 1fr;
  }

  .item-total {
    text-align: left;
  }
}
</style>
