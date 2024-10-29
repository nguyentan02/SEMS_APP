<script setup>
import { onMounted } from "vue";
import { useCategoryStore } from "@/stores/category.store";
import Loading from "@/components/common/Loading.vue";
const emit = defineEmits(["currentPage"]);
const categoryStore = useCategoryStore();
console.log(categoryStore.getCategory({ page: 1 }));
onMounted(async () => {
  emit("currentPage", "category");
  await categoryStore.getCategory({ name: "", page: 1 });
  categoryStore.currentPage = 1;
  categoryStore.name = "";
});
</script>
<template>
  <table class="table-auto border border-gray w-1/2 mt-5">
    <thead class="font-extralight">
      <tr class="text-left border-b border-black">
        <th class="text-center pb-2 w-[10%]">STT</th>
        <th class="pb-2">Tên danh mục</th>
        <th class="pb-2">Thuộc tính</th>
        <th class="text-center pb-2">Tùy chọn</th>
      </tr>
    </thead>
    <tbody v-if="!categoryStore.isLoading">
      <tr
        v-if="categoryStore.categorys?.length"
        v-for="(category, i) in categoryStore.categorys"
        :key="category.id"
        class="border-b transition duration-300 ease-in-out hover:bg-gray-300"
      >
        <td class="font-medium text-center w-[10%]">
          {{ (categoryStore.currentPage - 1) * 10 + i + 1 }}
        </td>
        <td class="">
          {{ category.categoryName }}
        </td>
        <td
          class="flex"
          v-for="(attribyute, i) in category.CategoryAttribyutes"
          :key="attribyute.id"
        >
          {{ attribyute.attribyute.name }}
        </td>
        <td class="w-[20%]">
          <div class="flex gap-2 items-center justify-center">
            <button class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button class="p-2 text-red-500 hover:text-red-400 text-2xl">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
      <tr v-else class="text-center text-red-500 text-xl">
        <td colspan="4">Không có.</td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr class="text-center text-red-500 text-xl">
        <td colspan="3" class="h-screen">
          <Loading />
        </td>
      </tr>
    </tbody>
  </table>
  <table></table>
</template>
