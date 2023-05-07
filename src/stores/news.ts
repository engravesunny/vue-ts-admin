import { defineStore } from 'pinia'
import { getNews, putNews } from '@/api'

export interface Info {
  [index: string]: unknown
}
export interface SignState {
  newsInfos: Info
}

const news = defineStore('news', {
  state: (): SignState => ({
    newsInfos: {}
  }),
  getters: {},
  actions: {
    updateNewsInfos(params: object) {
      return getNews(params).then((res) => {
        this.newsInfos = res.data.info
      }).catch((error) => {
        Promise.reject(error)
        console.error(error)
        return false
      })
    },
    updateState(data: object) {
      return putNews(data).then((res) => {
        this.newsInfos = res.data.info
      }).catch((error) => {
        Promise.reject(error)
        console.error(error)
        return false
      })
    },
    submitState(data: object) {
      return putNews(data).then((res) => {

      }).catch((error) => {
        Promise.reject(error)
        console.error(error)
        return false
      })
    }
  }
})

export default news
