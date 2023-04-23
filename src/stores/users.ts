import { defineStore, storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { login, setTime } from '../api/index'
import signs from './signs'
import pinia from '.'
import router from '@/router'
import type { User } from '@/views/Login/Login.vue'

const useSigns = signs(pinia)
const { infos } = storeToRefs(useSigns)
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
    },
    // 签到
    sign() {
      setTime({ userid: this.info._id }).then((res) => {
        console.log(1, infos)
        const { data: signInfo } = res
        if (signInfo.errcode === 0) {
          console.log(2, signInfo)
          useSigns.setInfos(signInfo.infos)
          ElMessage.success('签到成功')
        }
        console.log(3, infos)
      }).catch((error) => {
        console.error(error)
        Promise.reject(error)
      })
    }
  }
})

export default user
