<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">🔐 Connexion</h1>

      <input
        v-model="password"
        type="password"
        class="input"
        placeholder="Mot de passe"
      />

      <button @click="handleLogin" class="login-btn">
        🚀 Se connecter
      </button>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const password = ref('')
const error = ref('')

const handleLogin = async () => {
  error.value = ''
  try {
    await auth.login(password.value)
    router.push('/memecoins')
  } catch (err: any) {
    error.value = err.message
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #140c2a;
}

.login-box {
  background: #1f1539;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 420px;
  gap: 1.2rem;
}

.title {
  font-size: 1.8rem;
  color: white;
  text-align: center;
  margin-bottom: 1rem;
}

.input {
  padding: 0.8rem;
  border-radius: 8px;
  border: none;
  font-size: 1rem;
  outline: none;
  background-color: #2a1f4a;
  color: white;
}

.login-btn {
  background-color: #1e90ff;
  color: white;
  border: none;
  padding: 0.8rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.login-btn:hover {
  background-color: #147ce5;
}

.error {
  color: #ff4d4d;
  text-align: center;
  font-size: 0.95rem;
}
</style>