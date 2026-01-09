
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export const useProductStore = defineStore('products', () => {
  const products = ref([])

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`)
      products.value = response.data
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }


  // Get product by ID (busca sempre do backend)
  const getProduct = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }


  // Add new product
  const addProduct = async (product) => {
    try {
      const response = await axios.post(`${API_URL}/products`, product)
      await fetchProducts()
      return response.data
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }


  // Update product
  const updateProduct = async (id, product) => {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, product)
      await fetchProducts()
      return response.data
    } catch (error) {
      console.error('Error updating product:', error)
    }
  }


  // Delete product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`)
      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
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
