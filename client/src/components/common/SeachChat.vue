<script setup>
import { ref, watch } from "vue";

const props = defineProps(["title"]);
const emits = defineEmits(["key"]);

const key = ref("");

watch(key, (newval, oldval) => {
  emits("key", key.value);
});
</script>

<template>
  <div
    class="px-3 py-1 bg-[rgb(var(--color-primary))] rounded-xl flex items-center"
  >
    <i class="fa-solid fa-magnifying-glass"></i>
    <input
      type="text"
      :placeholder="props.title"
      v-model="key"
      class="p-1 rounded-xl border-0 flex-1 text-xs md:text-sm border-transparent focus:border-transparent focus:ring-0"
    />
  </div>
</template>
