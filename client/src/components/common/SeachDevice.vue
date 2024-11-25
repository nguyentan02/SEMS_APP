<script setup>
import { ref, watch } from "vue";
import Chip from "primevue/chip";

const props = defineProps(["title", "categoryName"]);
const emits = defineEmits(["key", "removeCategory"]);

const key = ref("");

watch(key, (newval, oldval) => {
  emits("key", key.value);
});
const removeCategory = () => {
  emits("removeCategory"); // Emit an event to clear the selected category in the parent
};
</script>

<template>
  <div class="px-5 py-1 flex items-center gap-1">
    <i class="fa-solid fa-magnifying-glass"></i>
    <Chip
      v-if="props.categoryName"
      :label="props.categoryName"
      removable
      class="mr-2 px-3 text-[#25861e] rounded-md"
      @remove="removeCategory"
    />
    <input
      type="text"
      :placeholder="props.title"
      v-model="key"
      class="rounded-xl py-1 bg-gray-100 border-0 flex-1 text-xs md:text-sm border-transparent focus:border-transparent focus:ring-0"
    />
  </div>
</template>
