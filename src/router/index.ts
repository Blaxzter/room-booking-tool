import { createRouter, createWebHistory } from 'vue-router'
import { useUser } from '@/stores/user'

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
          alias: ['/home'],
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
          component: () => import('@/views/BookableObjectView.vue'),
          props: (route) => ({
            id: route.params.id,
            date: route.query.date
          })
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/preauth/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/preauth/RegisterView.vue')
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('@/views/preauth/VerifyEmailView.vue')
    },
    {
      path: '/bookable-object/:id',
      alias: ['/room/:id', '/equipment/:id'],
      name: 'bookable-object',
      component: () => import('@/views/BookableObjectViewPublic.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const { checkAuth, setRedirect } = useUser()

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
