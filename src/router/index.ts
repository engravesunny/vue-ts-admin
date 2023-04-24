import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'
import _ from 'loadsh'
import pinia from '../stores'
import { getChecks, getSignInfo, getUserInfo } from '@/api'
import signs from '@/stores/signs'
import users from '@/stores/users'
import checks from '@/stores/checks'

const useSigns = signs(pinia)
const useStore = users(pinia)
const useChecks = checks(pinia)
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
        beforeEnter(to, from, next) {
          if (_.isEmpty(infos.value)) {
            getSignInfo({ userid: info.value._id }).then((res) => {
              const { data: signInfos } = res
              useSigns.setInfos(signInfos.infos)
              next()
            }).catch((error) => {
              Promise.reject(error)
              console.error(error)
            })
          }
          else {
            next()
          }
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
        beforeEnter(to, from, next) {
          if (_.isEmpty(applyList.value)) {
            getChecks({ applicantid: info.value._id }).then((res) => {
              const { data: applyListInfo } = res
              useChecks.updateApplyList(applyListInfo.rets)
              next()
            }).catch((error) => {
              Promise.reject(error)
              console.error(error)
            })
          }
          else {
            next()
          }
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
        beforeEnter(to, from, next) {
          if (_.isEmpty(infos.value)) {
            getSignInfo({ userid: info.value._id }).then((res) => {
              const { data: signInfos } = res
              useSigns.setInfos(signInfos.infos)
              next()
            }).catch((error) => {
              Promise.reject(error)
              console.error(error)
            })
          }
          else {
            next()
          }
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
        }
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
          next()
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
