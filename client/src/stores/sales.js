import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

const API_URL = 'http://localhost:3000/api'

export const useSalesStore = defineStore('sales', () => {
  const sales = ref([])
  const cart = ref([])
  const authStore = useAuthStore()

  // Helper para adicionar token nas requisições
  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' }
    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`
    }
    return headers
  }

  // Fetch all sales (requer autenticação)
  const fetchSales = async () => {
    try {
      const response = await fetch(`${API_URL}/sales`, {
        headers: getHeaders()
      })
      if (response.ok) {
        sales.value = await response.json()
      } else if (response.status === 401) {
        console.error('Não autenticado para buscar vendas')
      }
    } catch (error) {
      console.error('Error fetching sales:', error)
    }
  }

  // Complete sale (requer autenticação)
  const completeSale = async (items) => {
    try {
      const response = await fetch(`${API_URL}/sales`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ items })
      })
      
      if (response.ok) {
        await fetchSales()
        return await response.json()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao completar venda')
      }
    } catch (error) {
      console.error('Error completing sale:', error)
      throw error
    }
  }

  // Add to cart
  const addToCart = (product, quantity = 1) => {
    const existingItem = cart.value.find((item) => item.productId === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.value.push({
        productId: product.id,
        productName: product.name,
        quantity,
        price: product.price,
      })
    }
  }

  // Remove from cart
  const removeFromCart = (productId) => {
    cart.value = cart.value.filter((item) => item.productId !== productId)
  }

  // Update cart item quantity
  const updateCartQuantity = (productId, quantity) => {
    const item = cart.value.find((i) => i.productId === productId)
    if (item) {
      item.quantity = Math.max(1, quantity)
    }
  }

  // Clear cart
  const clearCart = () => {
    cart.value = []
  }

  // Calculate cart total
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  // Get today's sales
  const todaysSales = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return sales.value.filter((sale) => sale.timestamp.split('T')[0] === today)
  })

  // Get total revenue today
  const todaysRevenue = computed(() => {
    return todaysSales.value.reduce((total, sale) => total + sale.totalAmount, 0)
  })

  // Get total items sold today
  const todaysItemsSold = computed(() => {
    return todaysSales.value.reduce((total, sale) => {
      return total + sale.items.reduce((sum, item) => sum + item.quantity, 0)
    }, 0)
  })

  return {
    sales,
    cart,
    fetchSales,
    completeSale,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    todaysSales,
    todaysRevenue,
    todaysItemsSold,
  }
})
