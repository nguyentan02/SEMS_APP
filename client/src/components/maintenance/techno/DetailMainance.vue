<script setup>
import { onMounted, ref, reactive, watch, watchEffect } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useDeviceStore } from "@/stores/device.store";
import { Form, Field, ErrorMessage } from "vee-validate";
import { FwbButton, FwbTextarea, FwbModal } from "flowbite-vue";

import { useToast } from "vue-toast-notification";
import { useRouter, useRoute } from "vue-router";
import { useMaintenanceStore } from "@/stores/maintenance.store";
import Tag from "primevue/tag";
import Loading from "@/components/common/Loading.vue";
import dayjs from "dayjs";
const userStore = useUserStore();
const deviceStore = useDeviceStore();
const route = useRoute();
const maintenanceStore = useMaintenanceStore();
const value = ref(1);
const $toast = useToast();
const dialogVisible = ref(false);
const device = ref(null);
const router = useRouter();
const maintenanceStatus = ref(null);
const props = defineProps(["maintenanceEdit"]);
onMounted(async () => {});
const selectedStatus = ref("");
const data = reactive({
  title: "",
  deviceId: "",
  userId: "",
  startDate: "",
  endDate: "",
  descriptionPlan: "",
  priority: "LOW",
});

watchEffect(() => {
  if (props.maintenanceEdit) {
    data.title = props.maintenanceEdit?.title;
    device.value = props.maintenanceEdit?.Device;
    data.userId = props.maintenanceEdit?.User.id;
    data.deviceId = props.maintenanceEdit?.Device.id;
    maintenanceStatus.value = props.maintenanceEdit?.maintenanceStatus;
    selectedStatus.value = props.maintenanceEdit?.maintenanceStatus;
    data.startDate = dayjs(props.maintenanceEdit?.startDate).format(
      "DD-MM-YYYY"
    );
    data.endDate = dayjs(props.maintenanceEdit?.endDate).format("DD-MM-YYYY");
  }
});

const getSeverity = (status) => {
  switch (status) {
    case "CANCEL":
      return "danger";

    case "PENDING":
      return "secondary";

    case "APPROVED":
      return "info";

    case "COMPLETED":
      return "success";
    case "LATE":
      return "warning";
  }
};
const getValue = (status) => {
  switch (status) {
    case "CANCEL":
      return "Đã huỷ";

    case "PENDING":
      return "Đề nghị mới";

    case "APPROVED":
      return "Đang thực hiện";

    case "COMPLETED":
      return "Hoàn thành";
    case "LATE":
      return "Trễ hạn";
  }
};
const getPriority = (newValue) => {
  if (newValue === "LOW") {
    return "Thấp";
  } else if (newValue === "MEDIUM") {
    return "Thường";
  } else if (newValue === "HIGH") {
    return "Cao";
  }
};
const updateMaintenanceStatus = async (status) => {
  await maintenanceStore.updateStatus(props.maintenanceEdit?.id, { status });
  if (maintenanceStore.err) {
    $toast.error(maintenanceStore.err, { position: "top-right" });
    return;
  }
  $toast.success(maintenanceStore.result.message, { position: "top-right" });
  await maintenanceStore.getMaitenancesByTech({});
  maintenanceStore.closeDetail();
};
</script>

<template>
  <fwb-modal
    v-if="maintenanceStore.isShow.detailMaintenance"
    @close="maintenanceStore.closeDetail"
  >
    <template #header>
      <div class="flex items-center text-lg">
        <i class="fa-solid fa-circle-info mr-1"></i>Chi tiết yêu cầu
      </div>
    </template>
    <template #body>
      <div v-if="props.maintenanceEdit">
        <p class="mb-2"><strong>Tiêu đề:</strong> {{ data.title }}</p>
        <p class="mb-2">
          <strong>Thiết bị:</strong> {{ device.name }} ({{
            device.serialNumber
          }})
        </p>
        <p class="mb-2">
          <strong>Thời gian:</strong> {{ data.startDate }} đến
          {{ data.endDate }}
        </p>
        <p class="mb-2">
      <strong>Địa điểm:</strong> Phòng {{ props.maintenanceEdit?.Room.roomName }} /
          {{ props.maintenanceEdit?.Room.deparment.deparmentName }}
        </p>

        <p class="mb-2">
          <strong>Tiến độ:</strong>
          <Tag
            class="w-[120px] p-1 ml-1"
            :value="getValue(maintenanceStatus)"
            :severity="getSeverity(maintenanceStatus)"
          />
        </p>

        <p class="mb-2">
          <strong>Mức độ ưu tiên:</strong> {{ getPriority(data.priority) }}
        </p>
        <fwb-textarea
          v-model="data.descriptionPlan"
          readonly
          :rows="4"
          label="Ghi chú"
          placeholder="/"
        />
        <p class="mb-2">
          <strong>Cập nhật tiến độ:</strong>
          <Field
            as="select"
            id="status"
            name="status"
            v-model="selectedStatus"
            @change="updateMaintenanceStatus(selectedStatus)"
            class="ml-2 p-2 w-[200px] rounded-md"
          >
            <option value="COMPLETED">Hoàn thành</option>
            <option value="APPROVED" class="p">Chưa hoàn thành</option>
          </Field>
        </p>
      </div>

      <div v-else><Loading /></div>
    </template>
  </fwb-modal>
</template>
