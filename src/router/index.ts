import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '@/stores/auth' // 🔥 important

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
    },
    {
      path: '/fundamentals',
      name: 'Fundamentals',
      component: () => import('@/views/FundamentalsView.vue'),
    },
    {
      path: '/routing',
      name: 'Routing',
      component: () => import('@/views/RoutingView.vue'),
      meta: { sayHello: true },
    },
    {
      path: '/state',
      name: 'State',
      component: () => import('@/views/StateView.vue'),
    },
    {
      path: '/tests',
      name: 'Tests',
      component: () => import('@/views/TestsView.vue'),
    },
    {
      path: '/ajouter',
      name: 'AjoutMemecoins',
      component: () => import('@/views/AjoutMemecoins.vue'),
      meta: { requiresAuth: true } // 🔐 protégé
    },
    {
      path: '/memecoins',
      name: 'Memecoins',
      component: () => import('@/views/Memecoins.vue'),
      meta: { requiresAuth: true } // 🔐 protégé
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { hide: true },
    },
    {
      path: '/trading',
      name: 'Trading',
      component: () => import('@/views/Trading.vue'),
      meta: { requiresAuth: true } // protégé
    }    
  ],
})

// 🔐 Navigation guard global
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // message spécial pour la route "routing"
  if (to.meta.sayHello) {
    console.log('hello !')
  }

  // ✅ Redirection si non connecté sur une route protégée
  if (to.meta.requiresAuth && !auth.token) {
    return next('/login')
  }

  // 🚫 Empêche d'accéder à /login si déjà connecté
  if (to.path === '/login' && auth.token) {
    return next('/memecoins')
  }

  next()
})

export default router
