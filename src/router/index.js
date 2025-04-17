import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
    },
    {
      path: '/cabinet',
      name: 'cabinet',
      component: () => import('../views/AdminView.vue'),
    },
    {
      path: '/auth',
      name: 'authorization',
      component: () => import('../views/LoginForm.vue'),
    }
  ],
})

export default router
