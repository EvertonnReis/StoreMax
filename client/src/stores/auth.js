import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_URL = 'http://localhost:3000/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  // Restaurar usuário do localStorage ao iniciar
  const initAuth = async () => {
    if (token.value) {
      try {
        await fetchProfile()
      } catch (err) {
        logout()
      }
    }
  }

  // Fazer login
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login')
      }

      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Registrar novo usuário
  const register = async (name, email, password, role = 'user') => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao registrar')
      }

      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))

      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Buscar perfil do usuário
  const fetchProfile = async () => {
    if (!token.value) return

    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })

      if (!response.ok) {
        throw new Error('Sessão expirada')
      }

      const data = await response.json()
      user.value = data
      localStorage.setItem('user', JSON.stringify(data))
    } catch (err) {
      console.error('Erro ao buscar perfil:', err)
      throw err
    }
  }

  // Fazer logout
  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Helper para fazer requisições autenticadas
  const authFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      logout()
      throw new Error('Sessão expirada. Faça login novamente.')
    }

    return response
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    fetchProfile,
    initAuth,
    authFetch,
  }
})
