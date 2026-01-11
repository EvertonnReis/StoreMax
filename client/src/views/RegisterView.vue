<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>📝 Criar Conta - StoreMax</h2>
        <p>Preencha seus dados para começar</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="form-group">
          <label for="name">👤 Nome Completo</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Seu nome"
            required
            :disabled="loading"
            minlength="3"
          />
        </div>

        <div class="form-group">
          <label for="email">📧 E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">🔒 Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            :disabled="loading"
            minlength="6"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">🔒 Confirmar Senha</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Digite a senha novamente"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group checkbox-group">
          <label>
            <input
              v-model="isAdmin"
              type="checkbox"
              :disabled="loading"
            />
            <span>Criar como Administrador</span>
          </label>
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? 'Criando conta...' : 'Criar Conta' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Já tem uma conta?</p>
        <button @click="$emit('toggle-mode')" class="btn-link">
          Fazer login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const emit = defineEmits(['toggle-mode', 'register-success'])

const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isAdmin = ref(false)
const loading = ref(false)
const error = ref(null)

const handleRegister = async () => {
  // Validações
  if (password.value !== confirmPassword.value) {
    error.value = 'As senhas não coincidem'
    return
  }

  if (password.value.length < 6) {
    error.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }

  if (name.value.length < 3) {
    error.value = 'O nome deve ter pelo menos 3 caracteres'
    return
  }

  loading.value = true
  error.value = null

  const role = isAdmin.value ? 'admin' : 'user'
  const result = await authStore.register(name.value, email.value, password.value, role)

  if (result.success) {
    emit('register-success')
  } else {
    error.value = result.error
  }

  loading.value = false
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 420px;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h2 {
  color: #2d3748;
  font-size: 28px;
  margin: 0 0 8px 0;
}

.auth-header p {
  color: #718096;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #2d3748;
  font-weight: 600;
  font-size: 14px;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"] {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background: #f7fafc;
  cursor: not-allowed;
}

.checkbox-group {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #edf2f7;
  border-radius: 8px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin: 0;
  font-weight: 500;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.auth-footer p {
  color: #718096;
  margin: 0 0 8px 0;
}

.btn-link {
  background: none;
  border: none;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
  padding: 4px 8px;
}

.btn-link:hover {
  color: #764ba2;
}

.error-message {
  background: #fed7d7;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  border-left: 4px solid #c53030;
}
</style>
