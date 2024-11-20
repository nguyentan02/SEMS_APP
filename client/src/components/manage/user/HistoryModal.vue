<script setup>
import { FwbButton, FwbModal } from "flowbite-vue";
import { useManageStore } from "../../../stores/manage.store";
import dayjs from "dayjs";

const manageStore = useManageStore();
const props = defineProps(["user"]);
</script>

<template>
  <fwb-modal
    v-if="manageStore.isShow.history"
    @close="manageStore.closeHistoryModal"
  >
    <template #header>
      <div class="flex items-center text-xl gap-2 text-black">Lịch sử khóa</div>
    </template>
    <template #body>
      <div class="w-full max-h-60 overflow-y-scroll">
        <table class="table-fixed w-full text-black">
          <thead class="border-b border-black font-medium">
            <tr class="text-left">
              <th class="px-2 py-2 border border-black">STT</th>
              <th class="px-2 py-2 text-center border border-black">
                Ngày khóa
              </th>
              <th class="px-2 py-2 text-center border border-black">
                Thời gian khóa
              </th>
              <th class="px-2 py-2 text-center border border-black">Lý do</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-if="props.user?.Feedback.length"
              v-for="(feedback, i) in props.user?.Feedback"
              :key="i"
            >
              <td class="p-2 border border-black text-center">
                {{ i + 1 }}
              </td>
              <td class="p-2 border border-black">
                {{ dayjs(feedback.createdAt).format("LT L") }}
              </td>
              <td class="p-2 border border-black">
                {{
                  feedback.time == -1 ? "Vĩnh viễn" : feedback.time + " ngày"
                }}
              </td>
              <td class="p-2 border border-black break-words">
                {{ feedback.description }}
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
        <fwb-button @click="manageStore.closeHistoryModal" color="alternative">
          Đóng
        </fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
