import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const useSalesStore = defineStore('sales', () => {
  const sales = ref([])
  const cart = ref([])


  // Fetch all sales
  const fetchSales = async () => {
    try {
      const response = await axios.get(`${API_URL}/sales`)
      sales.value = response.data
    } catch (error) {
      console.error('Error fetching sales:', error)
    }
  }


  // Complete sale
  const completeSale = async (items) => {
    try {
      const response = await axios.post(`${API_URL}/sales`, { items })
      await fetchSales()
      return response.data
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
