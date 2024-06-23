import { createMemoryHistory, createRouter } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@app/pages/Index.vue') },
  { path: '/session', component: () => import('@app/pages/Session.vue') },
  { path: '/forgot-password', component: () => import('@app/pages/Home.vue') },
  { path: '/home', component: () => import('@app/pages/Home.vue') },
  { path: '/user', component: () => import('@app/pages/User.vue') },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
