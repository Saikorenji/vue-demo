import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userId = ref(localStorage.getItem('userId') || '')

  const isLoggedIn = () => !!token.value

  const login = async (password) => {
    const res = await fetch('https://nuxt-demo-blush.vercel.app/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur lors de la connexion')

    token.value = data.token
    userId.value = data.userId

    localStorage.setItem('token', token.value)
    localStorage.setItem('userId', userId.value)
  }

  const logout = () => {
    token.value = ''
    userId.value = ''
    localStorage.clear()
  }

  return { token, userId, login, logout, isLoggedIn }
})
