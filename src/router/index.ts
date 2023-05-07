import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { storeToRefs } from 'pinia'
import _ from 'loadsh'
import pinia from '../stores'
import { getSignInfo, getUserInfo } from '@/api'
import signs from '@/stores/signs'
import users from '@/stores/users'
import checks from '@/stores/checks'
import news from '@/stores/news'

const useNews = news(pinia)
const useSigns = signs(pinia)
const useStore = users(pinia)
const useChecks = checks(pinia)
const { newsInfos } = storeToRefs(useNews)
const { token, info } = storeToRefs(useStore)
const { infos } = storeToRefs(useSigns)
const { applyList } = storeToRefs(useChecks)
// const token = ''
// 引入组件
const Home: any = () => import('../views/Home/Home.vue')
const Check: any = () => import('../views/Check/Check.vue')
const Apply: any = () => import('../views/Apply/Apply.vue')
const Sign: any = () => import('../views/Sign/Sign.vue')
const Login: any = () => import('../views/Login/Login.vue')
const Exception: any = () => import('../views/Exception/Exception.vue')
const NotAuth: any = () => import('../views/NotAuth/NotAuth.vue')
const NotFound: any = () => import('../views/NotFound/NotFound.vue')
const NotServer: any = () => import('../views/NotServer/NotServer.vue')

// meta接口定义
declare module 'vue-router' {
  interface RouteMeta {
    menu?: boolean
    title?: string
    icon?: string
    auth?: boolean
  }
}
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    redirect: '/sign',
    component: Home,
    meta: {
      menu: true,
      title: '考勤管理',
      icon: 'icon-kaoqinguanli',
      auth: true
    },
    children: [
      {
        path: '/sign',
        name: 'sign',
        component: Sign,
        meta: {
          menu: true,
          title: '在线打卡签到',
          icon: 'icon-qiandao',
          auth: true
        },
        async beforeEnter(to, from, next) {
          if (_.isEmpty(infos.value)) {
            const res = await getSignInfo({ userid: info.value._id })
            useSigns.setInfos(res.data.infos)
          }
          if (_.isEmpty(newsInfos.value)) {
            await useNews.updateNewsInfos({ userid: info.value._id })
          }
          next()
        }
      },
      {
        path: '/apply',
        name: 'apply',
        component: Apply,
        meta: {
          menu: true,
          title: '添加考勤审批',
          icon: 'icon-tianjia',
          auth: true,
        },
        async beforeEnter(to, from, next) {
          if (_.isEmpty(applyList.value)) {
            await useChecks.updateApplyList()
          }
          if (newsInfos.value.applicant) {
            await useNews.updateState({ userid: info.value._id, applicant: false })
          }
          next()
        }
      },
      {
        path: '/exception',
        name: 'exception',
        component: Exception,
        meta: {
          menu: true,
          title: '异常考勤查询',
          icon: 'icon-yichang',
          auth: true,
        },
        async beforeEnter(to, from, next) {
          if (_.isEmpty(infos.value)) {
            const res = await getSignInfo({ userid: info.value._id })
            const { data: signInfos } = res
            if (signInfos.errcode === 0) {
              useSigns.setInfos(signInfos.infos)
            }
            else {
              return false
            }
          }
          if (_.isEmpty(applyList.value)) {
            await useChecks.updateApplyList()
          }
          if (_.isEmpty(newsInfos.value)) {
            await useNews.updateNewsInfos({ userid: info.value._id })
          }
          next()
        }
      },
      {
        path: '/check',
        name: 'check',
        component: Check,
        meta: {
          menu: true,
          title: '我的考勤审批',
          icon: 'icon-qianshoushenpitongguo-xianxing',
          auth: true,
        },
        async beforeEnter(to, from, next) {
          if (_.isEmpty(applyList.value)) {
            await useChecks.updateCheckList()
          }
          if (newsInfos.value.approver) {
            await useNews.updateState({ userid: info.value._id, approver: false })
          }
          next()
        }
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/403',
    name: 'NotAuth',
    component: NotAuth
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  },
  {
    path: '/500',
    name: 'NotServer',
    component: NotServer
  },
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const tokenCheck = token.value
  if (to.meta.auth && _.isEmpty(info.value)) {
    _.isEmpty(info.value)
    // 跳转非登录页面
    if (tokenCheck) {
      getUserInfo().then((res) => {
        if (res.data.errcode === 0) {
          useStore.updateInfo(res.data.infos)
          if ((res.data.infos.permission as string[]).includes(to.name as string)) {
            next()
          }
          else {
            next('/403')
          }
        }
      }).catch((error) => {
        Promise.reject(error)
      })
    }
    else {
      next('/login')
    }
  }
  else {
    // 跳转登录页面
    if (tokenCheck && to.path === '/login')
      next('/')
    else
      next()
  }
})

export default router
