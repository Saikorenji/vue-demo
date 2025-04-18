<template>
    <div class="memecoins-page">
      <h1>Liste des memecoins :</h1>
  
      <p v-if="loading">Chargement des memecoins...</p>
  
      <transition-group name="fade" tag="ul" class="memecoin-list" v-else>
        <li v-for="coin in memecoins" :key="coin.id" class="memecoin-item">
          <div class="memecoin-header">
            <img
              v-if="coin.logoUrl"
              :src="coin.logoUrl"
              alt="Logo"
              class="memecoin-logo"
              @error="coin.logoUrl = ''"
            />
            <strong>{{ coin.name }} ({{ coin.symbol }})</strong>
          </div>
          <p>{{ coin.description }}</p>
        </li>
      </transition-group>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const memecoins = ref([])
  const loading = ref(false)
  
  const fetchMemecoins = async () => {
    loading.value = true
    try {
      const res = await fetch('https://nuxt-demo-blush.vercel.app/api/get-memecoins')
      memecoins.value = await res.json()
    } catch (e) {
      console.error('Erreur lors du fetch', e)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(fetchMemecoins)
  </script>
  
  <style scoped>
  .memecoins-page {
    max-width: 600px;
    margin: auto;
    padding: 2rem;
    font-family: sans-serif;
  }
  
  .memecoin-item {
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
  }
  
  .memecoin-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .memecoin-logo {
    width: 40px;
    height: 40px;
    object-fit: contain;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
  </style>
  