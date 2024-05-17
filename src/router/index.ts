import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/',
          name: 'home',
          alias: ['/bookable-object/', '/room/', '/equipment/', '/home'],
          component: () => import('@/views/HomeView.vue')
        },
        {
          path: '/groups',
          name: 'groups',
          component: () => import('@/views/GroupView.vue')
        },
        {
          path: '/requests',
          name: 'requests',
          component: () => import('@/views/RequestView.vue')
        },
        {
          path: '/settings/:tab',
          name: 'settings',
          component: () => import('@/views/SettingsView.vue')
        },
        {
          path: '/bookable-object-edit/:id',
          alias: ['/room-edit/:id', '/equipment-edit/:id'],
          name: 'bookable-object-edit',
          component: () => import('@/views/BookableObjectEditView.vue')
        },
        {
          path: '/my-bookable-object/:id',
          alias: ['/my-room/:id', '/my-equipment/:id'],
          name: 'my-bookable-object',
          component: () => import('@/views/BookableObjectView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/bookable-object/:id',
      alias: ['/room/:id', '/equipment/:id'],
      name: 'bookable-object',
      component: () => import('@/views/BookableObjectViewPublic.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const { checkAuth, setRedirect } = useAuth()

  try {
    const isAuthenticated = await checkAuth()
    if (to.matched.some((record) => record.meta.requiresAuth) && !isAuthenticated) {
      setRedirect(to.fullPath)
      next({ name: 'login' })
    } else {
      next() // Proceed to the next route
    }
  } catch (error) {
    setRedirect(to.fullPath)
    next({ name: 'login' })
  }
})

export default router
