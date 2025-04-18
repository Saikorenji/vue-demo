<template>
  <div class="trading-page">
    <h2>💱 Trading de Memecoins</h2>

    <button class="claim-btn" @click="claimDailyReward" :disabled="hasClaimedToday">
      🎁 {{ hasClaimedToday ? "Déjà reçu aujourd'hui" : "Récupérer 100 ZTH quotidiens" }}
    </button>
    <p class="balance">Solde : {{ balance }} ZTH</p>

    <ul v-if="memecoins.length">
      <li v-for="coin in memecoins" :key="coin.symbol" class="coin-item">
        <strong>{{ coin.name }} ({{ coin.symbol }})</strong>
        <p>{{ coin.description }}</p>

        <p v-if="coin.a && coin.b && coin.supply !== undefined" class="estimation">
          💡 Avec {{ balance }} ZTH, tu peux acheter environ
          <strong>{{ estimateMaxBuyableTokens(coin.a, coin.b, coin.supply, balance) }}</strong>
          {{ coin.symbol }}
        </p>

        <div class="actions">
          <button @click="buy(coin.symbol)">Acheter</button>
          <button @click="sell(coin.symbol)">Vendre</button>
        </div>
      </li>
    </ul>

    <p v-if="message" :class="isError ? 'error' : 'success'">{{ message }}</p>

    <h3>📝 Historique de mes transactions</h3>
    <ul v-if="history.length">
      <li v-for="tx in history" :key="tx.id" class="tx-item">
        [{{ tx.timestamp }}] {{ tx.action }} {{ tx.symbol }} à {{ tx.price }} ZTH
      </li>
    </ul>
    <p v-else>Aucune transaction pour le moment</p>

    <h3>📈 Prix de GFT</h3>
    <canvas id="gftChart" width="400" height="200"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import Chart from "chart.js/auto";

const auth = useAuthStore();
const memecoins = ref<any[]>([]);
const message = ref("");
const isError = ref(false);
const balance = ref(0);
const history = ref<any[]>([]);
const gftPrices = ref<number[]>([]);
const chartInstance = ref<any>(null);
const hasClaimedToday = ref(false);

const estimateMaxBuyableTokens = (
  a: number,
  b: number,
  S: number,
  C: number
): number => {
  if (isNaN(a) || isNaN(b) || isNaN(S) || isNaN(C)) return 0;
  if (a <= 0) return 0;

  const A = a / 2;
  const B = a * S + b;
  const D = B * B + 4 * A * C;

  if (D < 0) return 0;

  const sqrtD = Math.sqrt(D);
  const X = (-B + sqrtD) / (2 * A);
  return Math.floor(X);
};

const fetchMemecoins = async () => {
  try {
    const res = await fetch(
      "https://nuxt-demo-blush.vercel.app/api/get-memecoins"
    );
    if (!res.ok) throw new Error("Erreur lors de la récupération des memecoins");
    memecoins.value = await res.json();
  } catch (err: any) {
    console.error("Erreur fetchMemecoins:", err);
    message.value = "Impossible de récupérer les données des memecoins.";
    isError.value = true;
  }
};

const fetchBalance = async () => {
  try {
    const res = await fetch("https://nuxt-demo-blush.vercel.app/api/get-balance", {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération du solde");
    const data = await res.json();
    balance.value = data.balance;
  } catch (err: any) {
    console.error("Erreur fetchBalance:", err);
    message.value = "Impossible de récupérer le solde.";
    isError.value = true;
  }
};

const fetchHistory = async () => {
  try {
    const res = await fetch("https://nuxt-demo-blush.vercel.app/api/history", {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération de l'historique");
    history.value = await res.json();
  } catch (err: any) {
    console.error("Erreur fetchHistory:", err);
    message.value = "Impossible de récupérer l'historique.";
    isError.value = true;
  }
};

const fetchPrices = async () => {
  try {
    const res = await fetch(
      "https://nuxt-demo-blush.vercel.app/api/price-history?symbol=GFT"
    );
    if (!res.ok) throw new Error("Erreur lors de la récupération des prix");
    const data = await res.json();
    gftPrices.value = data.prices;
    drawChart();
  } catch (err: any) {
    console.error("Erreur fetchPrices:", err);
    message.value = "Impossible de récupérer les prix.";
    isError.value = true;
  }
};

const drawChart = () => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const ctx = document.getElementById("gftChart") as HTMLCanvasElement;
  chartInstance.value = new Chart(ctx, {
    type: "line",
    data: {
      labels: gftPrices.value.map((_, i) => `T${i + 1}`),
      datasets: [
        {
          label: "Prix GFT",
          data: gftPrices.value,
          borderColor: "#4fc3f7",
          tension: 0.3,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: "white",
          },
        },
      },
      scales: {
        x: { ticks: { color: "white" } },
        y: { ticks: { color: "white" } },
      },
    },
  });
};

const claimDailyReward = async () => {
  message.value = "";
  try {
    const res = await fetch(
      "https://nuxt-demo-blush.vercel.app/api/claim-daily",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    const data = await res.json();
    if (!res.ok)
      throw new Error(data.message || "Impossible de récupérer la récompense.");
    message.value = `🎉 Tu as reçu 100 ZTH aujourd'hui !`;
    isError.value = false;
    hasClaimedToday.value = true;
    await fetchBalance();
  } catch (err: any) {
    console.error("Erreur claimDailyReward:", err);
    message.value = err.message;
    isError.value = true;
  }
};

const buy = async (symbol: string) => {
  message.value = "";
  try {
    const res = await fetch(
      `https://nuxt-demo-blush.vercel.app/api/mint?symbol=${symbol}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    message.value = `✅ Tu as acheté 1 ${symbol}`;
    isError.value = false;
    await fetchBalance();
    await fetchHistory();
  } catch (err: any) {
    console.error("Erreur buy:", err);
    message.value = err.message;
    isError.value = true;
  }
};

const sell = async (symbol: string) => {
  message.value = "";
  try {
    const res = await fetch(
      `https://nuxt-demo-blush.vercel.app/api/burn?symbol=${symbol}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    message.value = `✅ Tu as vendu 1 ${symbol}`;
    isError.value = false;
    await fetchBalance();
    await fetchHistory();
  } catch (err: any) {
    console.error("Erreur sell:", err);
    message.value = err.message;
    isError.value = true;
  }
};

onMounted(() => {
  fetchMemecoins();
  fetchBalance();
  fetchHistory();
  fetchPrices();
});
</script>

<style scoped>
.trading-page {
  max-width: 700px;
  margin: auto;
  padding: 2rem;
  font-family: sans-serif;
}
.balance {
  font-weight: bold;
  margin-bottom: 1rem;
}
.claim-btn {
  background-color: #28a745;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1rem;
}
.claim-btn:hover {
  background-color: #218838;
}
.claim-btn:disabled {
  background-color: #666;
  cursor: not-allowed;
}
.coin-item {
  margin-bottom: 1.5rem;
  padding: 1rem;
  border: 1px solid #555;
  border-radius: 6px;
  background-color: #1a1530;
}
.actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}
button {
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  opacity: 0.9;
}
.success {
  color: green;
}
.error {
  color: red;
}
.tx-item {
  font-size: 0.9rem;
  margin-bottom: 4px;
  background: #2a2344;
  padding: 0.4rem;
  border-radius: 4px;
}
canvas {
  margin-top: 1rem;
}
.estimation {
  font-size: 0.9rem;
  color: #cfcfcf;
  margin-top: 0.5rem;
}
</style>