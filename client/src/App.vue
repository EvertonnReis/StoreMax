<template>
  <div class="container">
    <header class="header">
      <h1>🛒 StoreMax - Sistema de Vendas</h1>
      <div class="header-info">
        <span class="connection-status connected">
          🟢 Online
        </span>
      </div>
    </header>

    <main class="main-content">
      <nav class="nav-tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          :class="['tab-btn', { active: activeTab === tab }]"
          @click="activeTab = tab"
        >
          {{ tabLabels[tab] }}
        </button>
      </nav>

      <div class="content">
        <ProductsView v-if="activeTab === 'products'" />
        <SalesView v-else-if="activeTab === 'sales'" />
        <CheckoutView v-else-if="activeTab === 'checkout'" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ProductsView from './views/ProductsView.vue'
import SalesView from './views/SalesView.vue'
import CheckoutView from './views/CheckoutView.vue'

const activeTab = ref('products')

const tabs = ['products', 'checkout', 'sales']
const tabLabels = {
  products: '📦 Produtos',
  checkout: '🛍️ Carrinho',
  sales: '📊 Vendas',
}
</script>

<style>
:root {
  --color-background: #f9fafb;
  --color-primary: #4f46e5;
  --color-secondary: #9333ea;
  --color-surface: #ffffff;
  --color-text: #1f2937;
  --color-muted: #6b7280;
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--color-background);
  color: var(--color-text);
  margin: 0;
  padding: 0;
}

header {
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
  color: var(--color-surface);
  padding: 1rem;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  border-bottom: 2px solid var(--color-primary);
}

main {
  padding: 2rem;
}

button {
  background: var(--color-primary);
  color: var(--color-surface);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: var(--color-secondary);
}

footer {
  background: var(--color-muted);
  color: var(--color-surface);
  text-align: center;
  padding: 1rem;
  font-size: 0.875rem;
}

:root {
  --color-primary: linear-gradient(90deg, #4c6ef5, #15aabf);
  --color-secondary: linear-gradient(90deg, #f06595, #e64980);
  --color-surface: #ffffff;
  --color-background: #f8f9fa;
  --color-text: #212529;
  --color-success: #37b24d;
  --color-warning: #f59f00;
  --color-danger: #e03131;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  background: var(--color-primary);
  color: var(--color-surface);
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  letter-spacing: 1px;
  margin: 0;
}

.header-info {
  display: flex;
  gap: 15px;
  align-items: center;
}

.connection-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.connection-status.connected {
  background: var(--color-success);
  color: var(--color-surface);
}

.connection-status.disconnected {
  background: var(--color-danger);
  color: var(--color-surface);
}

.main-content {
  background: var(--color-surface);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.nav-tabs {
  color: #15aabf;
  display: flex;
  background: var(--color-background);
  border-bottom: 2px solid #dee2e6;
  padding: 0.5rem;
  border-radius: 12px;
  gap: 10px;
  margin-left: 20px;
}

.tab-btn {
  color: var(--color-text);
  font-size: 1.2rem;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.tab-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.tab-btn.active {
  background: var(--color-primary);
  color: var(--color-surface);
}

.content {
  padding: 30px;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
  }

  .header h1 {
    font-size: 20px;
  }

  .nav-tabs {
    flex-direction: column;
  }

  .tab-btn {
    padding: 12px 16px;
    border-bottom: none;
    border-left: 3px solid transparent;
    margin-bottom: 0;
  }

  .tab-btn.active {
    border-left-color: #667eea;
    border-bottom: none;
  }
}
</style>
