<template>
  <div class="exception-title">
    <el-button type="primary" @click="handleToApply">
      异常处理
    </el-button>
    <el-space>
      <el-button plain>
        {{ year }}年
      </el-button>
      <el-select v-model="month">
        <el-option v-for="item in 12" :key="item" :value="item" :label="`${item}月`" />
      </el-select>
    </el-space>
  </div>
  <el-row v-if="detailMonth" :gutter="20">
    <el-col :span="12">
      <el-empty v-if="!detailMonth" description="暂无考勤详情" />
      <el-timeline v-else>
        <el-timeline-item v-for="item in detailMonth" :key="item[0]" :timestamp="`${year}/${toZero(month)}/${item[0]}`" placement="top">
          <el-card>
            <el-space>
              <h4>{{ item[1] }}</h4>
              <p>考勤情况：{{ renderDate(item[0]) }}</p>
            </el-space>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-col>
    <el-col :span="12">
      <el-empty v-if="false" description="暂无审批申请" />
      <el-timeline v-else>
        <el-timeline-item timestamp="事假" placement="top">
          <el-card>
            <h4>Update Github template</h4>
            <p class="apply-info">
              Tom committed 2018/4/12 20:46
            </p>
            <p class="apply-info">
              Tom committed 2018/4/12 20:46
            </p>
          </el-card>
        </el-timeline-item>
        <el-timeline-item timestamp="事假" placement="top">
          <el-card>
            <h4>Update Github template</h4>
            <p class="apply-info">
              Tom committed 2018/4/3 20:46
            </p>
            <p class="apply-info">
              Tom committed 2018/4/3 20:46
            </p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import signs from '@/stores/signs'
import { toZero } from '@/utils/common'

const useSigns = signs()
const route = useRoute()
const router = useRouter()
const date = new Date()
const year = date.getFullYear()
const month = ref(Number(route.query.month) || date.getMonth() + 1)
const { infos } = storeToRefs(useSigns)
const detailMonth = computed(() => {
  if (infos.value.detail) {
    const ret = ((infos?.value?.detail as { [index: string]: unknown })[toZero(month.value)] as { [index: string]: unknown })
    return Object.entries(ret)?.filter(item => item[1] !== '正常出勤').sort()
  }
  else {
    return []
  }
})

const handleToApply = () => {
  router.push('/apply')
}

const renderDate = (date: string) => {
  const res = ((infos.value.time as { [index: string]: unknown })[toZero(month.value)] as { [index: string]: unknown })[date]
  if (Array.isArray(res)) {
    return res.join('-')
  }
  else {
    return '暂无打卡记录'
  }
}

watch(month, (val) => {
  router.push({
    query: {
      month: val
    }
  })
})
</script>

<style lang="less" scoped>
.container{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.exception-title{
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
}
.el-row{
  width: 100%;
  display: flex;
}
.el-select{
    width: 80px;
}
.el-timeline{
  margin: 10px;
  box-sizing: border-box;
}
.apply-info{
  margin: 10px;
  box-sizing: border-box;
}
</style>
