import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/room/:id',
      name: 'room',
      component: () => import('../views/RoomView.vue'),
      meta: { requiresAuth: false }
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const { checkAuth } = useAuth()
  let isAuthenticated = false
  try {
    isAuthenticated = await checkAuth()
  } catch (error) {
    console.error(error)
  }
  
  if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
    console.log('Requires auth')
    next({ name: 'login' }) // Redirect to the login page if the user is not authenticated
  } else {
    next() // Proceed to the next route
  }
})

export default router
