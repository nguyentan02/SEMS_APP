<script setup>
import { FwbButton, FwbModal } from "flowbite-vue";
import { useManageStore } from "../../../stores/manage.store";
import dayjs from "dayjs";

const manageStore = useManageStore();

const props = defineProps(["category"]);
</script>

<template>
  <fwb-modal
    v-if="manageStore.isShow.detailModal"
    @close="manageStore.closeDetailModal"
  >
    <template #header>
      <div class="flex items-center text-lg gap-2 text-black">
        Thuộc tính danh mục {{ props.category.AttribyutesCategory.name }}
      </div>
    </template>
    <template #body>
      <div class="w-full max-h-60 overflow-y-scroll">
        <table class="table-fixed w-full text-black">
          <thead class="border-b border-black font-medium">
            <tr class="text-left">
              <th class="px-2 py-2 text-center border border-black w-[20%]">
                STT
              </th>
              <th class="px-2 py-2 text-center border border-black">
                Tên thuộc tính
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-if="props.category.AttribyutesCategory.length"
              v-for="(attribute, i) in props.category.AttribyutesCategory"
              :key="i"
            >
              <td class="p-2 border border-black text-center">
                {{ i + 1 }}
              </td>
              <td class="p-2 border border-black text-center">
                {{ attribute.name }}
              </td>
            </tr>
            <tr v-else class="text-center text-red-500 text-xl">
              <td colspan="4" class="border border-black p-2">Không có.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <fwb-button @click="manageStore.closeDetailModal" color="alternative">
          Đóng
        </fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
