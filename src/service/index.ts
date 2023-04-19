import axios from 'axios'
import type { AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { baseURL, timeout } from './config'

import pinia from '@/stores'
import users from '@/stores/users'

const useStore = users(pinia)

enum ResMsg {
  errcode = 0
}

const config = {
  baseURL,
  timeout
}

class Request {
  service
  constructor(config: CreateAxiosDefaults<any>) {
    this.service = axios.create(config)
    this.service.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
      return {
        ...config,
        headers: {
          Authorization: localStorage.getItem('TOKEN')
        }
      } as InternalAxiosRequestConfig
    }, (error: any) => {
      return Promise.reject(error)
    })
    this.service.interceptors.response.use((config: AxiosResponse<any, any>) => {
      // const { errcode }: any = config.data
      // if (errcode !== ResMsg.errcode)
      //   ElMessage.error('操作失败')
      if (config.data.errmsg === 'token error') {
        // token错误
        ElMessage.error('token error')
        // 清空token状态
        useStore.clearToken()
        setTimeout(() => {
          window.location.replace('/login')
        }, 1000)
      }
      return config
    }, (error: any) => {
      Promise.reject(error)
    })
  }

  get(url: string, params?: object) {
    return this.service.get(url, { params })
  }

  post(url: string, params?: object) {
    return this.service.post(url, params)
  }

  put(url: string, params?: object) {
    return this.service.put(url, params)
  }

  delete(url: string, params?: object) {
    return this.service.delete(url, { params })
  }
}

export default new Request(config)
