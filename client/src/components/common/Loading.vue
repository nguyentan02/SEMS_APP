<!-- <template>
  <div class="w-full h-full flex justify-center items-center">
    <div class="custom-loader"></div>
  </div>
</template>
<style scoped>
.custom-loader {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 8px solid;
  border-color: #3eca14 #ddd6d600;
  animation: s1 3s infinite;
}

@keyframes s1 {
  to {
    transform: rotate(0.5turn);
  }
}
</style> -->
<template>
  <fwb-spinner size="10" color="green" />
</template>

<script setup>
import { FwbSpinner } from "flowbite-vue";
</script>
