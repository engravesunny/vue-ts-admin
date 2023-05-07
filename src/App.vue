<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less">
.app {
  width: 100vw;
  height: 100vh;
}
@import './styles/reset.less';
@import './styles/iconfont.less';
@import './styles/common.less';
</style>
