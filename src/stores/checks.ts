import { defineStore, storeToRefs } from 'pinia'
import user from './users'
import type { ApplyList } from '@/views/Apply/Apply.vue'
import { getChecks, postApply } from '@/api/index'

const useUser = user()
const { info } = storeToRefs(useUser)
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
    updateApplyList() {
      getChecks({ applicantid: info.value._id }).then((res) => {
        const { data: applyListInfo } = res
        this.applyList = applyListInfo.rets
      }).catch((error) => {
        Promise.reject(error)
        console.error(error)
        return false
      })
      return true
    },
    addApply(applist: ApplyList) {
      postApply(applist).then((res) => {
        if (res.data.errcode === 0) {
          this.updateApplyList()
        }
        else {
          return false
        }
      })
      return true
    }
  }
})

export default checks
