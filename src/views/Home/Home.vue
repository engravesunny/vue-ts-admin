<template>
  <el-scrollbar>
    <el-container>
      <el-header>
        <HomeHeader />
      </el-header>
      <el-container>
        <el-aside width="200px">
          <HomeAside />
        </el-aside>
        <el-main>
          <HomeBreadcrumb />
          <HomeMain />
        </el-main>
      </el-container>
    </el-container>
  </el-scrollbar>
</template>

<script setup lang="ts">
import HomeAside from './components/HomeAside.vue'
import HomeBreadcrumb from './components/HomeBreadcrumb.vue'
import HomeHeader from './components/HomeHeader.vue'
import HomeMain from './components/HomeMain.vue'
</script>

<style lang="less" scoped>
.el-container{
  width: 100vw;
  height: 100vh;
}
.el-header{
  box-shadow: 0 8px 24px -2px rgb(0 0 0 / 5%);
}
.el-aside{
  box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}
.el-main{
  background: #f0f2f5;
  display: flex;
  flex-direction: column;
}
</style>
