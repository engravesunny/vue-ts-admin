<template>
  <el-menu
    :default-active="route.path"
    router
  >
    <el-sub-menu v-for="item in menu" :key="item.name" :index="item.path">
      <template #title>
        <el-icon>
          <icon :icon="item.meta?.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <el-menu-item v-for="child in item.children" :key="item.path + child.name" :index="child.path">
        <el-icon><icon :icon="child.meta?.icon" /></el-icon>
        <span>{{ child.meta.title }}</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import _ from 'loadsh'
import { useRoute, useRouter } from 'vue-router'
import icon from '@/components/icon.vue'
import user from '@/stores/users'

const { info } = user()
const permission = info.permission
const route = useRoute()
const router = useRouter()
const menu = (_.cloneDeep(router.options.routes) as Array<any>).filter((item) => {
  item.children = (item.children as Array<any>)?.filter(v => v.meta?.menu && (permission as Array<any>).includes(v.name))
  return item.meta?.menu && (permission as Array<any>).includes(item.name)
})
</script>

<style lang="less" scoped>
.el-menu{
  border: none;
}
.el-menu-item.is-active{
  background: #e6f7ff;
  border-right: 3px solid #1890ff;
}
.icon{
  font-size: 18px;
}
</style>
