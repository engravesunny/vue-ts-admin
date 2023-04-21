<template>
  <div class="home-header">
    <div class="left">
      <div class="icons">
        <icon icon="icon-Vue" class="icon-vue" />
        <span class="icon-jia iconfont">
          &#xe64d;
        </span>
        <icon icon="icon-typescript" class="icon-ts" />
      </div>
      <div class="title">
        刻猫猫在线考勤系统
      </div>
    </div>
    <div class="right">
      <div class="message">
        <el-dropdown>
          <el-badge>
            <div class="icon-message iconfont">
              &#xe62f;
            </div>
          </el-badge>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>暂无消息</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="avatar">
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar :src="info.head as string" /><span>&nbsp;{{ info.name }}</span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item @click="handleLogout">
                退出
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import icon from '@/components/icon.vue'
import user from '@/stores/users'

const useStore = user()
const { info } = storeToRefs(useStore)
const handleLogout = () => {
  useStore.clearToken()
  ElMessage.success('退出成功')
  setTimeout(() => {
    window.location.replace('/login')
  }, 500)
}
</script>

<style lang="less" scoped>
  .home-header{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // background-color: pink;
    .left{
      float: left;
      display: flex;
      align-items: center;
      .icons{
        display: flex;
        align-items: center;
        .icon-vue,.icon-ts,.icon-jia{
          font-size: 34px;
          margin: 0 4px;
        }
        .icon-jia{
          font-size: 28px;
          color: #deb887;
        }
      }
      .title{
        margin-left: 30px;
        font-weight: 700;
        font-size: 18px;
        margin-right: auto;
      }
    }
    .right{
      float: right;
      display: flex;
      align-items: center;
      .message{
        margin-right: 10px;
        .icon-message{
          font-size: 22px;
          cursor: pointer;
        }
      }
      .avatar{
        .el-dropdown-link{
          margin-left: 10px;
          display: flex;
          align-items: center;
        }
      }
    }
  }
</style>
