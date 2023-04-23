<template>
  <el-descriptions border direction="vertical" :column="9">
    <el-descriptions-item label="月份">
      {{ month }}月
    </el-descriptions-item>
    <el-descriptions-item v-for="v, key in detailKey" :key="key" :label="v">
      {{ keyValue[key] }}
    </el-descriptions-item>
    <el-descriptions-item label="操作">
      <el-button type="primary" plain @click="handleToException">
        查看详情
      </el-button>
    </el-descriptions-item>
    <el-descriptions-item label="考勤状态">
      <el-tag :type="detailCheck.type">
        {{ detailCheck.text }}
      </el-tag>
    </el-descriptions-item>
  </el-descriptions>
  <!-- 日历 -->
  <el-calendar v-if="isShow" v-model="value">
    <template #header>
      <el-button type="primary" @click="handleSetTime">
        在线签到
      </el-button>
      <el-space>
        <el-button plain>
          {{ year }}
        </el-button>
        <el-select v-model="month" @change="handleMonthChange">
          <el-option v-for="item in 12" :key="item" :value="item" :label="`${item}月`" />
        </el-select>
      </el-space>
    </template>
    <template #date-cell="{ data }">
      <div>{{ renderDay(data.day) }}</div>
      <div class="showTime">
        {{ renderTime(data.day) }}
      </div>
    </template>
  </el-calendar>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import user from '@/stores/users'
import signs from '@/stores/signs'
import { toZero } from '@/utils/common'

const value = ref(new Date())
const year = value.value.getFullYear()
const month = ref(value.value.getMonth() + 1)
// 考勤信息
const useSigns = signs()
const { infos } = storeToRefs(useSigns)

// 防止infos为空
const isShow = computed(() => infos.value.time || false)
const router = useRouter()

// 用户信息
const useStore = user()
const { info } = storeToRefs(useStore)

// 常量枚举
enum detailKey {
  normal = '正常出勤',
  absent = '旷工',
  empty = '漏打卡',
  later = '迟到',
  early = '早退',
  laterEarly = '迟到并早退'
}

const keyValue = reactive({
  normal: 0,
  absent: 0,
  empty: 0,
  later: 0,
  early: 0,
  laterEarly: 0
})

// 查看详情
const handleToException = () => {
  router.push({
    path: '/exception',
    query: {
      month: month.value
    }
  })
}

// 考勤状态
const detailCheck = reactive({
  type: 'success' as 'success' | 'danger',
  text: '正常' as '正常' | '异常'
})

// 日期转换
const handleMonthChange = () => {
  value.value = new Date(`${year}.${month.value}`)
}

// 日期信息渲染
const renderDay = (day: string) => {
  return day.split('-')[2]
}
const renderTime = (time: string) => {
  try {
    const [year, month, date] = time.split('-')
    const res = ((infos.value.time as { [index: string]: unknown })[month] as { [index: string]: unknown })[date]
    if (Array.isArray(res)) {
      return res.join('-')
    }
  }
  catch (error) {
    console.log('error', infos.value.time)

    console.log(error)
  }
}

// 在线签到

const handleSetTime = () => {
  useStore.sign()
}

// 监听月份变化

watchEffect((reset) => {
  if (infos.value.detail) {
    const detailMonth = ((infos.value.detail as { [index: string | number]: unknown })[toZero(month.value)] as { [index: string | number]: unknown })
    for (const attr in detailMonth) {
      switch (detailMonth[attr]) {
        case detailKey.absent:
          keyValue.absent++
          break
        case detailKey.normal:
          keyValue.normal++
          break
        case detailKey.empty:
          keyValue.empty++
          break
        case detailKey.later:
          keyValue.later++
          break
        case detailKey.early:
          keyValue.early++
          break
        case detailKey.laterEarly:
          keyValue.laterEarly++
          break
      }
    }
    // 考勤状态
    for (const attr in keyValue) {
      if (attr !== 'normal' && keyValue[attr as keyof typeof keyValue] !== 0) {
        detailCheck.type = 'danger'
        detailCheck.text = '异常'
      }
    }
    reset(() => {
      for (const attr in keyValue) {
        keyValue[attr as keyof typeof keyValue] = 0
      }
    })
  }
})
</script>

<style lang="less" scoped>
.el-descriptions{
  padding: 10px;
  box-sizing: border-box;
}
.el-select{
  width: 80px;
}
.showTime{
  text-align: center;
  line-height: 40px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
