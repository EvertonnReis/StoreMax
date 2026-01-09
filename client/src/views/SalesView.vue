<template>
  <div class="sales-view">
    <!-- Stats Dashboard -->
    <div class="stats-dashboard">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-value">{{ salesStore.todaysSales.length }}</div>
          <div class="stat-label">Vendas Hoje</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <div class="stat-value">
            {{ salesStore.todaysRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
          </div>
          <div class="stat-label">Faturamento Hoje</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <div class="stat-value">{{ salesStore.todaysItemsSold }}</div>
          <div class="stat-label">Itens Vendidos</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🏪</div>
        <div class="stat-content">
          <div class="stat-value">{{ productStore.availableProducts.length }}</div>
          <div class="stat-label">Produtos em Estoque</div>
        </div>
      </div>
    </div>

    <!-- Sales Table -->
    <div class="sales-section">
      <h2>📋 Histórico de Vendas</h2>

      <div class="filters">
        <input
          v-model="filterDate"
          type="date"
          class="filter-input"
        />
        <select v-model="sortBy" class="filter-input">
          <option value="recent">Mais Recentes</option>
          <option value="oldest">Mais Antigas</option>
          <option value="highest">Maior Valor</option>
          <option value="lowest">Menor Valor</option>
        </select>
      </div>

      <div v-if="filteredSales.length === 0" class="no-sales">
        Nenhuma venda encontrada
      </div>

      <div v-else class="sales-list">
        <div
          v-for="(sale, index) in filteredSales"
          :key="sale.id"
          class="sale-item"
          @click="toggleSaleDetails(index)"
        >
          <div class="sale-header">
            <div class="sale-info">
              <span class="sale-id">Venda #{{ (salesStore.sales.length - salesStore.sales.indexOf(sale)).toString().padStart(4, '0') }}</span>
              <span class="sale-time">{{ formatTime(sale.timestamp) }}</span>
            </div>

            <div class="sale-amount">
              {{ sale.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
            </div>

            <div class="sale-items-count">
              {{ sale.items.reduce((sum, item) => sum + item.quantity, 0) }} items
            </div>

            <span class="expand-icon" :class="{ expanded: expandedSale === index }">▼</span>
          </div>

          <div v-if="expandedSale === index" class="sale-details">
            <table class="items-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço Unit.</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in sale.items" :key="item.productId">
                  <td>{{ item.productName }}</td>
                  <td class="text-center">{{ item.quantity }}</td>
                  <td class="text-right">{{ item.price.toFixed(2) }}</td>
                  <td class="text-right font-bold">
                    {{ (item.price * item.quantity).toFixed(2) }}
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="sale-total">
              <span>Total da Venda:</span>
              <span class="amount">
                {{ sale.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
              </span>
            </div>
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
const salesStore = useSalesStore()
const expandedSale = ref(null)
const filterDate = ref(new Date().toISOString().split('T')[0])
const sortBy = ref('recent')

const toggleSaleDetails = (index) => {
  expandedSale.value = expandedSale.value === index ? null : index
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const filteredSales = computed(() => {
  let sales = salesStore.sales.filter(
    (sale) => sale.timestamp.split('T')[0] === filterDate.value
  )

  // Sort
  if (sortBy.value === 'oldest') {
    sales = sales.reverse()
  } else if (sortBy.value === 'highest') {
    sales.sort((a, b) => b.totalAmount - a.totalAmount)
  } else if (sortBy.value === 'lowest') {
    sales.sort((a, b) => a.totalAmount - b.totalAmount)
  } else {
    sales.reverse()
  }

  return sales
})
</script>

<style scoped>
.sales-view {
  background: var(--color-background);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stats-dashboard {
  /* background: var(--color-primary); */
  color: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.stat-card {
  background: var(--color-secondary);
  color: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.sale-item {
  background: var(--color-surface);
  border: 1px solid #dee2e6;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  padding: 1.5rem;
}

.sale-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.sale-header {
  background: var(--color-primary);
  color: var(--color-surface);
  padding: 1.5rem;
  border-radius: 12px;
}

.sale-total {
  background: var(--color-secondary);
  color: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

/* Stats Dashboard */
.stats-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.stat-icon {
  font-size: 32px;
  min-width: 50px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  opacity: 0.9;
}

/* Sales Section */
.sales-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sales-section h2 {
  margin: 0;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
}

/* Filters */
.filters {
  display: flex;
  gap: 10px;
}

.filter-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  flex: 1;
  max-width: 300px;
}

.filter-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Sales List */
.no-sales {
  text-align: center;
  color: #999;
  padding: 40px 20px;
}

.sales-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sale-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.sale-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.sale-header {
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: 20px;
  align-items: center;
  padding: 16px;
  background: #f9f9f9;
  cursor: pointer;
  transition: background 0.3s;
}

.sale-header:hover {
  background: #f0f0f0;
}

.sale-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sale-id {
  font-weight: 600;
  color: #333;
  font-size: 15px;
}

.sale-time {
  color: #999;
  font-size: 13px;
}

.sale-amount {
  font-weight: bold;
  color: #667eea;
  font-size: 16px;
  text-align: right;
}

.sale-items-count {
  color: #666;
  font-size: 14px;
  text-align: right;
}

.expand-icon {
  color: #999;
  transition: transform 0.3s;
  font-size: 12px;
  min-width: 20px;
  text-align: center;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

/* Sale Details */
.sale-details {
  padding: 20px 16px;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  font-size: 14px;
}

.items-table thead {
  background: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
}

.items-table th {
  padding: 10px;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.items-table td {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
}

.items-table .text-center {
  text-align: center;
}

.items-table .text-right {
  text-align: right;
}

.items-table .font-bold {
  font-weight: 600;
  color: #333;
}

.sale-total {
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  font-weight: 600;
  font-size: 16px;
}

.sale-total .amount {
  color: #667eea;
  min-width: 150px;
  text-align: right;
}

@media (max-width: 768px) {
  .stats-dashboard {
    grid-template-columns: 1fr 1fr;
  }

  .sale-header {
    grid-template-columns: 1fr auto;
    gap: 10px;
  }

  .sale-amount,
  .sale-items-count {
    grid-column: 1;
    text-align: left;
  }

  .expand-icon {
    grid-column: 2;
    grid-row: 1 / 4;
  }

  .filters {
    flex-direction: column;
  }

  .filter-input {
    max-width: 100%;
  }

  .items-table {
    font-size: 12px;
  }

  .items-table th,
  .items-table td {
    padding: 8px 4px;
  }
}
</style>
