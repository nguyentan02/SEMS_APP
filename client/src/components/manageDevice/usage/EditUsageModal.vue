<script setup>
import { useUsageStore } from "@/stores/usage.store";
import { onMounted, reactive, ref, watchEffect, watch } from "vue";
import { FwbButton, FwbModal, FwbTextarea } from "flowbite-vue";
import { Form, Field, ErrorMessage, useField, useForm } from "vee-validate";
import Dialog from "primevue/dialog";
import { useRoute } from "vue-router";
import * as yup from "yup";
import { useToast } from "vue-toast-notification";
import Button from "primevue/button";
import Tag from "primevue/tag";
import dayjs from "dayjs";
const props = defineProps(["currentUsage"]);
const route = useRoute();
const roomIdTest = route.params.id;
const usageStore = useUsageStore();
const $toast = useToast();
const formatDate = (date) => {
  return dayjs(date).format("YYYY-MM-DD");
};
// onMounted(async () => {
//   console.log(props.currentUsage);
// });
const data = reactive({
  usage_start: "",
  usage_end: "",
  purpose: "",
});
const formSchemaUsage = yup.object().shape({
  usage_start: yup.string().required("Vui lòng chọn ngày."),
  usage_end: yup.string().required("Vui lòng chọn ngày."),
});
const editUsage = async () => {
  console.log(data);
  await usageStore.updateUsage(props.currentUsage?.id, data);
  if (usageStore.err) {
    $toast.error(usageStore.err, { position: "top-right" });
    return;
  }
  $toast.success(usageStore.result.message, { position: "top-right" });
  usageStore.closeEditUsage();
  await usageStore.getUsageByIdRoom(roomIdTest);
};
watch(
  () => props.currentUsage,
  (newVal) => {
    if (newVal) {
      data.usage_start = formatDate(newVal.usage_start);
      data.usage_end = formatDate(newVal.usage_end);
      data.purpose = newVal.purpose;
    }
  }
);
const getSeverity = (status) => {
  switch (status) {
    case "unqualified":
      return "danger";

    case "":
      return "success";

    case "ĐANG HOẠT ĐỘNG":
      return "success";

    case "negotiation":
      return "warning";

    case "renewal":
      return null;
  }
};
</script>

<template>
  <Form
    v-if="usageStore.isShow.editUsage"
    @submit="editUsage"
    :validation-schema="formSchemaUsage"
  >
    <fwb-modal @close="usageStore.closeEditUsage" :persistent="true">
      <template #header>
        <div class="flex items-center text-lg">
          <i class="fa-regular fa-pen-to-square mr-2"></i> Chỉnh sửa thông tin
        </div>
      </template>
      <template #body>
        <div class="flex justify-between">
          <div>
            <p class="font-semibold">ID: {{ props.currentUsage?.Device.id }}</p>
            <p class="font-semibold">
              Thiết bị: {{ props.currentUsage?.Device.name }}
            </p>
            <span class="font-semibold">
              Serial:
              <p class="font-normal inline-block">
                {{ props.currentUsage?.Device.serialNumber }}
              </p></span
            >
            <span class="block font-semibold"
              >Trạng thái:
              <Tag
                class="p-1"
                :value="props.currentUsage.Device.statusDevice"
                :severity="getSeverity(props.currentUsage.Device.statusDevice)"
              ></Tag>
            </span>
          </div>
          <div class="flex align-items-center gap-2">
            <img
              alt="flag"
              :src="props.currentUsage.Device.image"
              style="width: 100px"
            />
          </div>
        </div>

        <div class="mt-2">
          <div class="flex items-center mb-4">
            <label for="usage_start" class="label-custom mr-2 mt-2"
              >Ngày bắt đầu:</label
            >
            <div class="w-[70%]">
              <Field
                type="date"
                name="usage_start"
                id="usage_start"
                class="w-auto input-edit"
                v-model="data.usage_start"
              >
              </Field>
              <ErrorMessage name="usage_start" class="error" />
            </div>
          </div>
          <div class="flex items-center mb-4">
            <label for="usage_end" class="label-custom mr-2 mt-2"
              >Ngày hết hạn:</label
            >
            <div class="w-[70%]">
              <Field
                type="date"
                name="usage_end"
                id="usage_end"
                class="w-auto input-edit"
                v-model="data.usage_end"
              >
              </Field>
              <ErrorMessage name="usage_end" class="error" />
            </div>
          </div>
          <fwb-textarea
            v-model="data.purpose"
            :rows="4"
            label="Ghi chú"
            placeholder="Viết ghi chú..."
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between">
          <fwb-button color="green"> Cập nhật </fwb-button>
          <fwb-button @click="usageStore.closeEditUsage" color="alternative"
            >Hủy</fwb-button
          >
        </div>
      </template>
    </fwb-modal>
  </Form>

  <!-- Dialog chọn thiết bị -->
</template>
