<template>
  <div class="app">
    <el-button type="primary">
      <el-icon :size="20">
        <Edit />
      </el-icon>
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'

interface List {
  name: string
  age: number
}
const list = reactive<List[]>([])
list.push({
  name: '123',
  age: 20,
})
const count = ref(0)
count.value = 2

onMounted(() => {
  console.log(list)
})
</script>
