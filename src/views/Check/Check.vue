<template>
  <div class="checkContainer">
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
  <div class="check-table">
    <el-table :data="pagecheckListx" border style="width: 100%">
      <el-table-column prop="applicantname" label="申请人" width="180" />
      <el-table-column prop="reason" label="审批事由" width="180" />
      <el-table-column prop="time" label="时间">
        <template #default="scope">
          {{ scope.row.time.join(' - ') }}
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注" />
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button circle size="small" type="success" class="iconfont icon" @click="putApply(scope.row._id, '已通过', scope.row.applicantid)">
            &#xebe6;
          </el-button>
          <el-button circle size="small" type="danger" class="iconfont icon" @click="putApply(scope.row._id, '未通过', scope.row.applicantid)">
            &#xe6c9;
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="180" />
    </el-table>
    <el-pagination v-if="checkListx.length" small background :page-size="pageSize" layout="prev,pager,next" :total="checkListx.length" @current-change="handleChange" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import checks from '@/stores/checks'
import news from '@/stores/news'

const useNews = news()
const useChecks = checks()
const { checkList } = storeToRefs(useChecks)
const defaultType = '全部'
const applyValue = ref(defaultType)
const searchValue = ref('')
const pageSize = ref(2)
const pageCurrent = ref(1)
const checkListx = computed(() => checkList.value.filter(v => (v.state === applyValue.value || defaultType === applyValue.value) && (v.note as string).includes(searchValue.value)))
const pagecheckListx = computed(() => checkListx.value.slice((pageCurrent.value - 1) * pageSize.value, pageCurrent.value * pageSize.value))
const handleChange = (val: number) => {
  pageCurrent.value = val
}

const putApply = async (_id: string, state: '已通过' | '未通过', id: string) => {
  await useChecks.toPutApply({ _id, state })
  await useNews.submitState({ userid: id, applicant: true })
}
</script>

<style lang="less" scoped>
.checkContainer {
  margin: 20px;
  display: flex;
  justify-content: flex-end;
}

.icon{
  font-size: 16px;
}
.check-table{
  margin: 10px;
}
.el-pagination{
  margin-top: 10px;
  float: right;
}
</style>
