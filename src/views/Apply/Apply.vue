<template>
  <div class="apply-title">
    <el-button type="primary">
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
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import checks from '@/stores/checks'

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
onMounted(() => {
  console.log(applyListx)
})
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
