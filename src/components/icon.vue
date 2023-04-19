<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="`#${icon}`" />
  </svg>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const Props = defineProps({
  icon: {
    type: String,
    default: ''
  }
})
</script>

<style lang="less" scoped>

</style>
