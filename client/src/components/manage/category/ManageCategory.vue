<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { useCategoryStore } from "@/stores/category.store";
import { useManageStore } from "@/stores/manage.store";
import AddCategory from "./AddCategory.vue";
import EditCategoryModal from "./EditCategoryModal.vue";
import Loading from "@/components/common/Loading.vue";
import DetailCategory from "./DetailCategory.vue";
import { FwbButton } from "flowbite-vue";
import { useToast } from "vue-toast-notification";
import Seach from "@/components/common/Seach.vue";
const emit = defineEmits(["currentPage"]);
const $toast = useToast();

const manageStore = useManageStore();
const currentCategory = ref(null);
const categoryStore = useCategoryStore();
const deleteCategory = async (id) => {
  const conFirm = confirm("Bạn có chắc chắn muốn xóa?");
  if (conFirm) {
    await categoryStore.deleteCategory(id);
    if (categoryStore.err) {
      $toast.error(categoryStore.err, { position: "top-right" });
      return;
    }
    $toast.success(categoryStore.result.message, { position: "top-right" });
    await categoryStore.getCategory({
      name: categoryStore.name,
      page: categoryStore.currentPage,
    });
  }
};
watchEffect(async () => {
  await categoryStore.getCategory({
    name: categoryStore.name,
    page: categoryStore.currentPage,
  });
});
onMounted(async () => {
  emit("currentPage", "category");
  await categoryStore.getCategory({ name: "", page: 1 });
  categoryStore.currentPage = 1;
  categoryStore.name = "";
});
</script>
<template>
  <h1 class="text-2xl font-bold mb-10">Quản lý danh mục</h1>
  <div class="flex items-center justify-between">
    <Seach
      :title="'Tìm kiếm danh mục'"
      @key="
        (e) => {
          categoryStore.name = e;
        }
      "
    />
    <fwb-button
      color="default"
      size="sm"
      @click="
        () => {
          manageStore.showAddCategoryModal();
        }
      "
      >Thêm danh mục <i class="fa-solid fa-plus"></i
    ></fwb-button>
  </div>

  <table
    class="table-auto w-10/12 mt-5 bg-[rgb(var(--color-primary))] rounded-md mx-auto"
  >
    <thead class="font-medium border-b border-black">
      <tr class="text-left border-b">
        <th class="text-center pb-2 w-[10%]">STT</th>
        <th class="p-2">Tên danh mục</th>
        <th class="p-2 text-center">Mô tả</th>
        <th class="p-2 text-center">Số lượng thiết bị</th>
        <th class="p-2"></th>
        <th class="text-center p-2">Tùy chọn</th>
      </tr>
    </thead>
    <tbody v-if="!categoryStore.isLoading">
      <tr
        v-if="categoryStore.categorys?.length"
        v-for="(category, i) in categoryStore.categorys"
        :key="category.id"
        class="border-b transition duration-300 ease-in-out hover:bg-[#bbb8b8]"
      >
        <td class="font-medium text-center w-[10%]">
          {{ (categoryStore.currentPage - 1) * 10 + i + 1 }}
        </td>
        <td class="">
          {{ category.categoryName }}
        </td>

        <td class="">
          {{ category.description || "---" }}
        </td>
        <td class="text-center">
          {{ category.devicesCount }}
        </td>
        <td class="text-center">
          <a
            class="text-blue-600 cursor-pointer hover:opacity-75 border-b border-blue-500"
            @click="
              () => {
                manageStore.showDetailModal();
                currentCategory = category;
              }
            "
            >Chi tiết
          </a>
        </td>
        <!-- <td
          class="flex"
          v-for="(attribyute, i) in category.CategoryAttribyutes"
          :key="attribyute.id"
        >
          {{ attribyute.attribyute.name }}
        </td> -->
        <td class="w-[20%]">
          <div class="flex gap-2 items-center justify-center">
            <button
              class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl"
              @click="
                () => {
                  manageStore.showEditCategoryModal();
                  currentCategory = category;
                }
              "
            >
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button
              class="p-2 text-red-500 hover:text-red-400 text-2xl"
              @click="
                async () => {
                  await deleteCategory(category.id);
                }
              "
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
      <tr v-else class="text-center text-red-500 text-xl">
        <td colspan="7">Không có.</td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr class="text-center text-red-500 text-xl">
        <td colspan="7">
          <Loading />
        </td>
      </tr>
    </tbody>
  </table>
  <table></table>
  <AddCategory />
  <DetailCategory :category="currentCategory" />
  <EditCategoryModal :category="currentCategory" />
</template>
