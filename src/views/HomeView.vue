<template>
  <div class="home">
    <h1 class="title">Bienvenue sur ZTH Network ✨</h1>
    <p class="subtitle">
      Une plateforme décentralisée pour créer, trader et explorer des memecoins 100% fun et 100% communautaires.
    </p>

    <div class="actions">
      <RouterLink to="/memecoins" class="btn">Explorer les Memecoins</RouterLink>
      <RouterLink to="/ajouter" class="btn">Créer un Memecoin</RouterLink>
      <RouterLink to="/trading" class="btn">Accéder au Trading</RouterLink>
    </div>

    <section class="infos">
      <h2>💡 Comment ça fonctionne ?</h2>
      <ul>
        <li>Chaque utilisateur reçoit 100 ZTH à l'inscription.</li>
        <li>Créer un memecoin coûte 1 ZTH.</li>
        <li>Les memecoins se tradent via un système de bonding curve intelligent.</li>
        <li>Achetez ou vendez en toute simplicité depuis l'interface Trading.</li>
      </ul>
    </section>

    <footer class="footer">
      <p>&copy; 2025 ZTH Network. Memecoins, fun et ZTH — made with Vue 3 & Pinia.</p>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home {
  padding: 3rem 2rem;
  max-width: 800px;
  margin: auto;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
  color: white;
}
.title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.subtitle {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  color: #cfcfcf;
}
.actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
}
.btn {
  background-color: #4fc3f7;
  color: #000;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
.btn:hover {
  background-color: #29b6f6;
}
.infos {
  text-align: left;
  background: #231e39;
  padding: 2rem;
  border-radius: 12px;
  margin-top: 2rem;
}
.infos h2 {
  margin-bottom: 1rem;
}
.infos ul {
  padding-left: 1.5rem;
  list-style: disc;
}
.footer {
  margin-top: 4rem;
  font-size: 0.85rem;
  color: #888;
}
</style>
