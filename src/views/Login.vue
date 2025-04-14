<template>
    <div class="login">
      <h1>Connexion</h1>
      <form @submit.prevent="handleLogin">
        <input v-model="password" type="password" placeholder="Mot de passe" />
        <button type="submit">Se connecter</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  
  const password = ref('')
  const error = ref('')
  const auth = useAuthStore()
  const router = useRouter()
  
  const handleLogin = async () => {
    error.value = ''
    if (!password.value) {
      error.value = 'Mot de passe requis.'
      return
    }
  
    try {
      await auth.login(password.value)
      router.push('/exercices') // redirection après connexion
    } catch (err) {
      error.value = err.message
    }
  }
  </script>
  
  <style scoped>
  .login {
    max-width: 400px;
    margin: auto;
    padding: 2rem;
  }
  input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
  }
  button {
    width: 100%;
    padding: 0.5rem;
  }
  .error {
    color: red;
  }
  </style>
  