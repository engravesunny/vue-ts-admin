<template>
  <div class="apply-title">
    <el-button type="primary" @click="handleOpen">
      添加审批
    </el-button>
    <el-space>
      <el-input v-model="searchValue" placeholder="请输入搜索内容" />
      <el-button type="primary">
        <div class="iconfont icon">
          &#xe8b9;
        </div>
        &nbsp;
        <span>搜索</span>
      </el-button>
      <el-divider direction="vertical" />
      <el-radio-group v-model="applyValue">
        <el-radio-button label="全部" />
        <el-radio-button label="待审批" />
        <el-radio-button label="已通过" />
        <el-radio-button label="未通过" />
      </el-radio-group>
    </el-space>
  </div>
  <div class="apply-table">
    <el-table :data="pageapplyListx" border style="width: 100%">
      <el-table-column prop="applicantname" label="申请人" width="180" />
      <el-table-column prop="reason" label="审批事由" width="180" />
      <el-table-column prop="time" label="时间">
        <template #default="scope">
          {{ scope.row.time.join(' - ') }}
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" />
      <el-table-column prop="approvername" label="审批人" width="180" />
      <el-table-column prop="state" label="状态" width="180" />
    </el-table>
    <el-pagination v-if="applyListx" small background :page-size="pageSize" layout="prev,pager,next" :total="applyListx.length" @current-change="handleChange" />
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="添加审批"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="formRef" :model="userForm" :rules="rules" label-width="80px">
      <el-form-item label="审批人" required prop="approvername">
        <el-select v-if="approver" v-model="userForm.approvername" placeholder="请选择审批人">
          <el-option v-for="item in approver" :key="item._id as string" :value="item.name as string" :label="item.name as string" />
        </el-select>
      </el-form-item>
      <el-form-item label="审批事由" required prop="reason">
        <el-select v-model="userForm.reason">
          <el-option value="年假" label="年假" />
          <el-option value="事假" label="事假" />
        </el-select>
      </el-form-item>
      <el-form-item label="时间" required prop="time">
        <el-date-picker
          v-model="userForm.time"
          type="datetimerange"
          start-placeholder="起始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="备注" required prop="note">
        <el-input
          v-model="userForm.note"
          type="textarea"
          placeholder="请输入备注"
          :auto-size="{ minRows: 4, maxRows: 6 }"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleReset(formRef)">重置</el-button>
        <el-button type="primary" @click="submitForm(formRef)">
          提交
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { type DateModelType, ElMessage, type FormInstance, type FormRules, } from 'element-plus'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import checks from '@/stores/checks'
import user from '@/stores/users'

const useUser = user()

const { info } = storeToRefs(useUser)

export interface ApplyList {
  applicantid: string // 申请人ID
  applicantname: string // 申请人姓名
  approverid: string // 审批人ID
  approvername: string // 审批人姓名
  note: string // 审批备注
  reason: string // 审批事由
  time: [DateModelType, DateModelType] // 审批时间
}

const formRef = ref<FormInstance>()
const userForm = reactive <ApplyList>({
  applicantid: '',
  applicantname: '',
  approverid: '',
  approvername: '',
  note: '',
  reason: '',
  time: ['', '']
})

const approver = computed(() => info.value.approver as { [index: string]: unknown }[])

const validatorTime = (rule: unknown, value: [DateModelType, DateModelType], callback: (arg?: Error) => void) => {
  if (!value[0] && !value[1]) {
    callback(new Error('请选择审批时间'))
  }
  else {
    callback()
  }
}

const rules = reactive<FormRules>({
  approvername: [
    { required: true, message: '请选择审批人', trigger: 'blur' }
  ],
  time: [
    { validator: validatorTime, trigger: 'blur' }
  ],
  reason: [
    { required: true, message: '请选择审批事由', trigger: 'blur' }
  ],
  note: [
    { required: true, message: '请填写备注', trigger: 'blur' }
  ]
})

const dialogVisible = ref(false)
const searchValue = ref('')
const useChecks = checks()
const { applyList } = storeToRefs(useChecks)
const defaultType = '全部'
const applyValue = ref(defaultType)
const pageSize = ref(2)
const pageCurrent = ref(1)
const applyListx = computed(() => applyList.value.filter(v => (v.state === applyValue.value || defaultType === applyValue.value) && (v.note as string).includes(searchValue.value)))
const pageapplyListx = computed(() => applyListx.value.slice((pageCurrent.value - 1) * pageSize.value, pageCurrent.value * pageSize.value))
const handleChange = (val: number) => {
  pageCurrent.value = val
}

const handleClose = () => {
  dialogVisible.value = false
}
const handleOpen = () => {
  dialogVisible.value = true
}

const handleReset = (formEL: FormInstance | undefined) => {
  if (!formEL)
    return 1
  else {
    formEL.resetFields()
  }
}

const submitForm = (formEL: FormInstance | undefined) => {
  if (!formRef.value) {
    return false
  }
  else {
    formRef.value.validate((isOK) => {
      if (isOK) {
        userForm.applicantid = info.value._id as string
        userForm.applicantname = info.value.name as string
        userForm.approverid = ((info.value.approver as { [index: string]: unknown }[]).find(item => item.name === userForm.approvername) as { [index: string]: unknown })._id as string
        userForm.time[0] = moment(userForm.time[0]).format('YYYY-MM-DD hh:mm:ss')
        userForm.time[1] = moment(userForm.time[1]).format('YYYY-MM-DD hh:mm:ss')
        if (useChecks.addApply(userForm)) {
          ElMessage.success('添加成功')
          handleReset(formRef.value)
          handleClose()
        }
        else {
          ElMessage('添加失败')
        }
      }
      else {
        return false
      }
    })
  }
}
</script>

<style lang="less" scoped>
.icon{
  font-size: 16px;
}
.apply-title{
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
.apply-table{
  margin: 10px;
}
.el-pagination{
  margin-top: 10px;
  float: right;
}
</style>
