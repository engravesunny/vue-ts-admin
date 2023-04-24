import { defineStore } from 'pinia'

export interface Infos {
  [index: string]: unknown
}
export interface CheckState {
  applyList: Infos[]
}

const checks = defineStore('checks', {
  state: (): CheckState => ({
    applyList: []
  }),
  getters: {},
  actions: {
    updateApplyList(list: Infos[]) {
      this.applyList = list
    }
  }
})

export default checks
