import type { RouteRecordRaw } from 'vue-router'
import { createMemoryHistory, createRouter } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@app/pages/IndexPage.vue') },
  { path: '/session', component: () => import('@app/pages/SessionPage.vue') },
  {
    path: '/forgot-password',
    component: () => import('@app/pages/HomePage.vue'),
  },
  { path: '/home', component: () => import('@app/pages/HomePage.vue') },
  { path: '/user', component: () => import('@app/pages/UserPage.vue') },
  { path: '/post', component: () => import('@app/pages/PostPage.vue') },
  { path: '/post/edit', component: () => import('@app/pages/PostEditor.vue') },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
