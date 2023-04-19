import { defineStore } from 'pinia'
import { login } from '../api/index'
import router from '@/router'
import type { User } from '@/views/Login/Login.vue'

export interface UserInfo {
  [index: string]: unknown
}
export interface UserState {
  token: string
  info: UserInfo
}

const user = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('TOKEN') || '',
    info: {}
  }),
  getters: {},
  actions: {
    updateToken(newtoken: string) {
      this.token = newtoken
    },
    updateInfo(newInfo: UserInfo) {
      this.info = newInfo
    },
    clearToken() {
      localStorage.removeItem('TOKEN')
      this.token = ''
    },
    login(userData: User) {
      login(userData).then(async (res) => {
        try {
          // 本地存储token
          localStorage.setItem('TOKEN', res.data.token)
          this.updateToken(res.data.token)
          // 跳转路由
          router.push('/')
        }
        catch (error) {
          console.error(error)
          Promise.reject(error)
        }
      }).catch((error) => {
        Promise.reject(error)
      })
    }
  }
})

export default user
