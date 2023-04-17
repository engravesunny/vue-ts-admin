import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const Home: any = () => import('../views/Home/Home.vue')
const Check: any = () => import('../views/Check/Check.vue')
const Apply: any = () => import('../views/Apply/Apply.vue')
const Sign: any = () => import('../views/Sign/Sign.vue')
const Login: any = () => import('../views/Login/Login.vue')

declare module 'vue-router' {
  interface RouteMeta {
    // 是可选的
    isAdmin?: boolean
    // 每个路由都必须声明
    requiresAuth: boolean
    // name 可选
    name?: string
  }
}
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => Home,
    meta: {
      requiresAuth: true,
      isAdmin: true
    }
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
router.beforeEach((to, from, next) => {
  console.log(to, from, next)
  next()
})

export default router
