<script setup>
import { FwbModal } from "flowbite-vue";
import { useAuthStore } from "../../stores/auth.store";
import dayjs from "dayjs";

const props = defineProps(["feedback"]);
console.log(props.feedback);
const authStore = useAuthStore();
</script>

<template>
  <fwb-modal
    v-if="authStore.isShow.feedback"
    @close="authStore.closeFeedbackModal"
    size="2xl"
    :not-escapable="true"
  >
    <template #header>
      <div class="flex items-center gap-2 font-semibold text-2xl text-black">
        Lý do
      </div>
    </template>
    <template #body>
      <div class="flex flex-col gap-3">
        <h1 class="text-lg text-red-500">
          Lý do khóa: {{ props.feedback?.description }}.
        </h1>
        <h1 class="text-sm text-black">
          Ngày bắt đầu khóa:
          {{ dayjs(props.feedback?.createdAt).format("DD/MM/YYYY") }}.
        </h1>
        <h1 class="text-sm text-black">
          Thời gian khóa:
          {{
            props.feedback?.time == -1
              ? "Vĩnh viễn"
              : `${props.feedback?.time} ngày`
          }}.
        </h1>
        <p class="text-center italic text-lg text-blue-500">
          Mọi thắc mắc vui lòng liên hệ email:
          <span class="underline"> help.ems.management@gmail.com </span>
          để được giảiquyết.
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          @click="authStore.closeFeedbackModal"
          class="px-3 py-2 bg-red-500 rounded-lg text-white hover:bg-red-600 text-sm font-semibold"
        >
          Đóng
        </button>
      </div>
    </template>
  </fwb-modal>
</template>
