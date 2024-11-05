<template>
  <div class="card flex justify-content-center">
    <Button label="Submit" />
  </div>
  <div class="card flex justify-content-center text-black">
    <InputText type="text" v-model="value" />
  </div>
</template>
<script setup>
import Button from "primevue/button";

import InputText from "primevue/inputtext";

import Slider from "primevue/slider";
import { ref } from "vue";

const value = ref(null);
</script>
