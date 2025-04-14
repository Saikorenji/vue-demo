<template>
  <nav class="navbar">
    <router-link to="/">Accueil</router-link>
    <router-link v-if="!auth.token" to="/login">Se connecter</router-link>
    <button v-else @click="auth.logout(); $router.push('/login')" class="logout">Se déconnecter</button>
  </nav>
  <router-view />
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<style scoped>
.navbar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #0f013b;
}
.logout {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>
