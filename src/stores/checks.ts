import { defineStore, storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import user from './users'
import { getChecks, postApply, putApply } from '@/api/index'

const useUser = user()
const { info } = storeToRefs(useUser)
export interface Infos {
  [index: string]: unknown
}
export interface CheckState {
  applyList: Infos[]
  checkList: Infos[]
}

const checks = defineStore('checks', {
  state: (): CheckState => ({
    applyList: [],
    checkList: []
  }),
  getters: {},
  actions: {
    updateApplyList() {
      return getChecks({ applicantid: info.value._id }).then((res) => {
        const { data: applyListInfo } = res
        this.applyList = applyListInfo.rets
      }).catch((error) => {
        Promise.reject(error)
        console.error(error)
        return false
      })
    },
    updateCheckList() {
      return getChecks({ approverid: info.value._id }).then((res) => {
        const { data: checkListInfo } = res
        this.checkList = checkListInfo.rets
      }).catch((error) => {
        Promise.reject(error)
        console.error(error)
        return false
      })
    },
    addApply(applist: object) {
      postApply(applist).then((res) => {
        if (res.data.errcode === 0) {
          this.updateApplyList()
        }
        else {
          return false
        }
      })
      return true
    },
    toPutApply(putList: { _id: string; state: '已通过' | '未通过' }) {
      return putApply(putList).then((res) => {
        if (res.data.errcode === 0) {
          ElMessage.success('审批成功')
          this.updateCheckList()
        }
      })
    }
  }
})

export default checks
