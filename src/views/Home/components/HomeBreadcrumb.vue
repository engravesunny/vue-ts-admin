<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="item in breadcrumb" :key="item.path">
      {{ item.meta?.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const breadcrumb = computed(() => route.matched)
</script>

<style lang="less" scoped>
.el-breadcrumb{
  background: #fff;
  height: 40px;
  line-height: 40px;
  display: flex;
  align-items: center;
  padding-left: 30px;
}
</style>
