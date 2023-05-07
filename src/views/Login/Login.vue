<template>
  <div class="login-page">
    <div class="container">
      <div class="header">
        <div class="title">
          <div class="icons">
            <icon icon="icon-Vue" class="icon-vue" />
            <span class="icon-jia iconfont">
              &#xe64d;
            </span>
            <icon icon="icon-typescript" class="icon-ts" />
          </div>
          <div class="text">
            刻猫猫在线考勤系统
          </div>
        </div>
        <div class="des">
          刻猫猫在线考勤系统（此处写描述语句）
        </div>
      </div>
      <div class="main">
        <el-form ref="formRef" :model="userForm" :rules="rules" label-width="120px">
          <el-form-item label="邮箱" required prop="email">
            <el-input v-model="userForm.email" type="text" placeholder="请输入邮箱" style="width: 350px;" />
          </el-form-item>
          <el-form-item label="密码" required prop="pass">
            <el-input v-model="userForm.pass" type="password" placeholder="请输入密码" style="width: 350px;" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" auto-insert-space @click="submitForm(userForm)">
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <div class="test1">
          <div class="top">
            <span style="font-size: 16px;">测试账号，</span>
            <el-button class="btn" @click="submitForm({ email: 'huangrong@imooc.com', pass: 'huangrong' })">
              一键登录
            </el-button>
          </div>
          <div class="info">
            <div class="email">
              邮箱：huangrong@imooc.com
            </div>
            <div class="pass">
              密码：huangrong
            </div>
          </div>
        </div>
        <div class="test2">
          <div class="top">
            <span style="font-size: 16px;">测试账号，</span>
            <el-button class="btn" @click="submitForm({ email: 'hongqigong@imooc.com', pass: 'hongqigong' })">
              一键登录
            </el-button>
          </div>
          <div class="info">
            <div class="email">
              邮箱：hongqigong@imooc.com
            </div>
            <div class="pass">
              密码：hongqigong
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import icon from '../../components/icon.vue'
import users from '@/stores/users'

const useStore = users()
interface User {
  email: string
  pass: string
}

const formRef = ref<FormInstance>()
const userForm = reactive <User>({
  email: '',
  pass: ''
})
const rules = reactive<FormRules>({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  pass: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
})
const submitForm = (user: User) => {
  userForm.email = user.email
  userForm.pass = user.pass
  if (!formRef.value) {
    return false
  }
  else {
    formRef.value.validate((isOK) => {
      if (isOK) {
        try {
          useStore.login(user)
          ElMessage.success('登陆成功')
          // 跳转到主页
        }
        catch (error) {
          console.error(error)
          ElMessage.warning('登陆失败')
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
.login-page{
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  background:url(../../assets/img/login-bg.svg) no-repeat center 110px;
  background-size: 100%;
  .container{
    padding-top: 100px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .header{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .title{
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px;
        .icons{
          .icon-vue{
            font-size: 34px;
          }
          .icon-ts{
            font-size: 34px;
          }
          .icon-jia{
            font-size: 30px;
            color: #deb887;
          }
        }
        .text{
          font-size: 30px;
          font-weight: 700;
          margin-left: 30px;
        }
      }
      .des{
        min-width: 300px;
        margin: 50px 0 60px 0;
        color: rgba(0, 0, 0, 0.45);
      }
    }
    .footer{
      width: 100%;
      padding-top: 50px;
      padding-left: 70px;
      display: flex;
      justify-content: center;
      .test1,.test2{
        display: flex;
        flex-direction: column;
        margin: 20px;
        .top{
          .btn{
            width: 100px;
          }
        }
        .info{
          margin: 10px 0;
          .email,.pass{
              font-size: 16px;
              color: rgba(0, 0, 0, 0.85);
              font-weight: 100;
          }
        }
      }
    }
  }
}
</style>
