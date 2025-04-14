<template>
  <div class="exercices">
    <h1>Liste des memecoins :</h1>

    <p v-if="loading">Chargement des memecoins...</p>

    <ul v-else>
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
    </ul>

    <hr />

    <h2>Ajout d'un memecoin</h2>

    <form @submit.prevent="handleSubmit">
      <div>
        <label>Nom</label>
        <input class="input" v-model="form.name" placeholder="Nom du memecoin" />
        <span v-if="errors.name" class="error">{{ errors.name }}</span>
      </div>

      <div>
        <label>Symbole</label>
        <input class="input" v-model="form.symbol" placeholder="SYM" />
        <span v-if="errors.symbol" class="error">{{ errors.symbol }}</span>
      </div>

      <div>
        <label>Description</label>
        <textarea class="input" v-model="form.description" placeholder="Description (optionnel)" />
        <span v-if="errors.description" class="error">{{ errors.description }}</span>
      </div>

      <div>
        <label>Logo URL</label>
        <input class="input" v-model="form.logoUrl" placeholder="https://..." />
        <span v-if="errors.logoUrl" class="error">{{ errors.logoUrl }}</span>
      </div>

      <button class="btn" type="submit" :disabled="loading">
        {{ loading ? 'Envoi...' : 'Envoyer' }}
      </button>

      <p v-if="submitError" class="error">{{ submitError }}</p>
      <p v-if="success" class="success">Memecoin créé avec succès !</p>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

const memecoins = ref([])
const loading = ref(false)

const form = ref({
  name: '',
  symbol: '',
  description: '',
  logoUrl: ''
})

const errors = ref({})
const submitError = ref('')
const success = ref(false)

const validateForm = () => {
  errors.value = {}
  let valid = true

  if (form.value.name.length < 4 || form.value.name.length > 16) {
    errors.value.name = 'Le nom doit faire entre 4 et 16 caractères.'
    valid = false
  }

  if (!/^[A-Z]{2,4}$/.test(form.value.symbol)) {
    errors.value.symbol = 'Le symbole doit être en MAJUSCULES (2 à 4 lettres).'
    valid = false
  }

  if (form.value.description.length > 1000) {
    errors.value.description = 'Max 1000 caractères.'
    valid = false
  }

  if (form.value.logoUrl && !/^https?:\/\/.+\..+/.test(form.value.logoUrl)) {
    errors.value.logoUrl = 'URL invalide.'
    valid = false
  }

  return valid
}

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

const handleSubmit = async () => {
  success.value = false
  submitError.value = ''
  errors.value = {}

  if (!validateForm()) return

  loading.value = true
  try {
    const res = await fetch('https://nuxt-demo-blush.vercel.app/api/create-memecoin-protected', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify(form.value)
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Erreur lors de la création')

    success.value = true
    form.value = { name: '', symbol: '', description: '', logoUrl: '' }

    await fetchMemecoins()

    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err) {
    submitError.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!auth.token) {
    router.push('/login') // redirection si non connecté
    return
  }

  fetchMemecoins()
})
</script>

<style scoped>
.exercices {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  font-family: sans-serif;
}

.input,
textarea,
button {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error {
  color: red;
  font-size: 0.9em;
}

.success {
  color: green;
  font-weight: bold;
}

form > div {
  margin-bottom: 1rem;
}

.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn:disabled {
  background-color: #aaa;
  cursor: not-allowed;
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
</style>
