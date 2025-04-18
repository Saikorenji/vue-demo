<template>
  <div>
    <nav class="navbar">
      <RouterLink to="/">🏠 Accueil</RouterLink>
      <RouterLink to="/memecoins">🪙 Memecoins</RouterLink>
      <RouterLink to="/ajouter">➕ Ajouter</RouterLink>
      <RouterLink to="/trading" class="nav-link">🔁 Trading</RouterLink>

      <button v-if="auth.isLoggedIn()" @click="handleLogout" class="logout-btn">Se déconnecter</button>
      <RouterLink v-else to="/login" class="login-btn">Connexion</RouterLink>
    </nav>

    <RouterView />
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #1a1234;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  color: white;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.nav-left,
.nav-right {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  position: relative;
  transition: color 0.3s;
  display: flex;
  align-items: center;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0%;
  height: 2px;
  background: white;
  transition: width 0.3s ease-in-out;
}

.nav-link:hover::after {
  width: 100%;
}

.logout,
.login {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.logout {
  background-color: #e74c3c;
}

.login {
  background-color: #007bff;
}

.logout:hover {
  background-color: #c0392b;
}

.login:hover {
  background-color: #0056b3;
}
</style>