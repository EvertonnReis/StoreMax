
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

const API_URL = 'http://localhost:3000/api'

export const useProductStore = defineStore('products', () => {
  const products = ref([])
  const authStore = useAuthStore()

  // Helper para adicionar token nas requisições
  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' }
    if (authStore.token) {
      headers.Authorization = `Bearer ${authStore.token}`
    }
    return headers
  }

  // Fetch all products (público)
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: getHeaders()
      })
      if (response.ok) {
        products.value = await response.json()
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  // Get product by ID (público)
  const getProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        headers: getHeaders()
      })
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }

  // Add new product (requer admin)
  const addProduct = async (product) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(product)
      })
      
      if (response.ok) {
        await fetchProducts()
        return await response.json()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao adicionar produto')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      throw error
    }
  }

  // Update product (requer admin)
  const updateProduct = async (id, product) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(product)
      })
      
      if (response.ok) {
        await fetchProducts()
        return await response.json()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao atualizar produto')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      throw error
    }
  }

  // Delete product (requer admin)
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      })
      
      if (response.ok) {
        await fetchProducts()
        return true
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao deletar produto')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      throw error
    }
  }

  // Get available products
  const availableProducts = computed(() => {
    return products.value.filter((p) => p.quantity > 0)
  })

  // Get low stock products (quantity < 10)
  const lowStockProducts = computed(() => {
    return products.value.filter((p) => p.quantity > 0 && p.quantity < 10)
  })

  return {
    products,
    fetchProducts,
    getProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    availableProducts,
    lowStockProducts,
  }
})
