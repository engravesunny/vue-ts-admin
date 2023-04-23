import { defineStore } from 'pinia'

export interface Info {
  [index: string]: unknown
}
export interface SignState {
  infos: Info
}

const signs = defineStore('signs', {
  state: (): SignState => ({
    infos: {}
  }),
  getters: {},
  actions: {
    setInfos(info: Info) {
      this.infos = info
    }
  }
})

export default signs
