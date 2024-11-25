<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useDeviceStore } from "@/stores/device.store";
import { Form, Field, ErrorMessage } from "vee-validate";
import {
  FwbButton,
  FwbTextarea,
  FwbBreadcrumb,
  FwbBreadcrumbItem,
} from "flowbite-vue";
import Tag from "primevue/tag";
import Dialog from "primevue/dialog";
import Rating from "primevue/rating";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import IconField from "primevue/iconfield";
import InputText from "primevue/inputtext";
import { FilterMatchMode } from "primevue/api";
import * as yup from "yup";
import { useToast } from "vue-toast-notification";
import { useRouter, useRoute } from "vue-router";
import InputIcon from "primevue/inputicon";
import { useMaintenanceStore } from "@/stores/maintenance.store";
import Loading from "../common/Loading.vue";
import dayjs from "dayjs";
const userStore = useUserStore();
const deviceStore = useDeviceStore();
const route = useRoute();
const maintenanceStore = useMaintenanceStore();
const value = ref(1);
const $toast = useToast();
const dialogVisible = ref(false);
const selectedDevices = ref({});
const device = ref(null);
const router = useRouter();
const maintenanceEdit = ref(null);
const maintenanceStatus = ref(null);
const maintenanceId = route.params.id;
onMounted(async () => {
  await userStore.getTechnical();
  await deviceStore.getDevicesByMaintenance();
  await maintenanceStore.getMaitenanceById(maintenanceId);
  maintenanceEdit.value = maintenanceStore.maintenance;
});

const data = reactive({
  title: "",
  deviceId: "",
  userId: "",
  startDate: "",
  endDate: "",
  descriptionPlan: "",
  priority: "LOW",
});
const formSchemaMaintenance = yup.object().shape({
  title: yup
    .string()
    .min(10, "Tối thiểu 10 kí tự")
    .required("Không được bỏ trống."),
  userId: yup.string().required("Hãy chọn người phụ trách."),
  startDate: yup.string().required("Vui lòng chọn ngày bắt đầu."),
  endDate: yup.string().required("Vui lòng chọn thời hạn."),
});
const roomParent = ref(null);

watch(maintenanceEdit, async (newDeviceEdit) => {
  if (newDeviceEdit) {
    data.title = newDeviceEdit.title;
    device.value = newDeviceEdit.Device;

    data.userId = newDeviceEdit.User.id;
    data.deviceId = newDeviceEdit.Device.id;
    roomParent.value = newDeviceEdit.Room;

    maintenanceStatus.value = newDeviceEdit.maintenanceStatus;
    data.startDate = dayjs(newDeviceEdit.startDate).format("YYYY-MM-DD");
    data.endDate = dayjs(newDeviceEdit.endDate).format("YYYY-MM-DD");
  }
});
const updateMaintenance = async () => {
  console.log(data);
  await maintenanceStore.updateMaitenance(maintenanceId, data);
  if (maintenanceStore.err) {
    $toast.error(maintenanceStore.err, { position: "top-right" });
    return;
  }

  $toast.success(maintenanceStore.result.message, { position: "top-right" });
  await maintenanceStore.getMaitenanceById(maintenanceId);
  maintenanceStatus.value = maintenanceStore.maintenance.maintenanceStatus;

  await deviceStore.getDevicesByMaintenance();
};

const deleteMaintenance = async () => {
  await maintenanceStore.deleteMaintenance(maintenanceId);
  if (maintenanceStore.err) {
    $toast.error(maintenanceStore.err, { position: "top-right" });
    return;
  }
  $toast.warning(maintenanceStore.result.message, { position: "top-right" });
  await maintenanceStore.getMaitenanceById(maintenanceId);
  maintenanceStatus.value = maintenanceStore.maintenance.maintenanceStatus;
  await deviceStore.getDevicesByMaintenance();
};
const resMaintenance = async () => {
  await maintenanceStore.resMaintenance(maintenanceId);
  if (maintenanceStore.err) {
    $toast.error(maintenanceStore.err, { position: "top-right" });
    return;
  }
  $toast.success(maintenanceStore.result.message, { position: "top-right" });
  await maintenanceStore.getMaitenanceById(maintenanceId);
  maintenanceStatus.value = maintenanceStore.maintenance.maintenanceStatus;
  await deviceStore.getDevicesByMaintenance();
};
const sendMaintenance = async () => {
  await maintenanceStore.updateMaitenance(maintenanceId, data);
  await maintenanceStore.sendMaintenance(maintenanceId);
  if (maintenanceStore.err) {
    $toast.error(maintenanceStore.err, { position: "top-right" });
    return;
  }
  $toast.success(maintenanceStore.result.message, { position: "top-right" });
  await maintenanceStore.getMaitenanceById(maintenanceId);
  maintenanceStatus.value = maintenanceStore.maintenance.maintenanceStatus;
  await deviceStore.getDevicesByMaintenance();
};
const confirmSelection = () => {
  device.value = selectedDevices.value;
  data.deviceId = device.value.id;
  dialogVisible.value = false;
};
const openDeviceDialog = (event) => {
  event.preventDefault();
  dialogVisible.value = true;
};
watch(value, (newValue) => {
  if (newValue === 1) {
    data.priority = "LOW";
  } else if (newValue === 2) {
    data.priority = "MEDIUM";
  } else if (newValue === 3) {
    data.priority = "HIGH";
  }
});
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
const getPriority = (newValue) => {
  if (newValue === "LOW") {
    return "Thấp";
  } else if (newValue === "MEDIUM") {
    return "Thường";
  } else if (newValue === "HIGH") {
    return "Cao";
  }
};
const filters = ref();
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};
initFilters();
</script>

<template>
  <fwb-breadcrumb>
    <fwb-breadcrumb-item
      home
      href="#"
      @click="
        () => {
          router.back();
        }
      "
      class="mb-4"
    >
      <template #home-icon>
        <i class="fa-solid fa-circle-chevron-left mr-1"></i>
      </template>
      Trở về
    </fwb-breadcrumb-item>
  </fwb-breadcrumb>

  <div class="flex items-center justify-between text-black mb-4">
    <button
      v-if="maintenanceStatus != 'CANCEL' && maintenanceStatus != 'COMPLETED'"
      class="bg-[#d6d3d1] px-3 py-2 text-black rounded-md hover:opacity-85"
      @click="deleteMaintenance"
    >
      <i class="fa-solid fa-ban mr-1"></i> Huỷ
    </button>
    <button
      v-else-if="maintenanceStatus === 'CANCEL'"
      class="bg-[#d6d3d1] px-3 py-2 text-black rounded-md hover:opacity-85"
      @click="resMaintenance"
    >
      <i class="fa-solid fa-rotate-right mr-1"></i>Mở lại kế hoạch
    </button>

    <button
      v-if="
        maintenanceStatus != 'APPROVED' &&
        maintenanceStatus != 'COMPLETED' &&
        maintenanceStatus != 'CANCEL' &&
        maintenanceStatus != 'LATE'
      "
      class="bg-[#2563eb] px-3 py-2 text-white rounded-md hover:opacity-85"
      @click="sendMaintenance"
    >
      <i class="fa-regular fa-paper-plane mr-1"></i> Gửi
    </button>
  </div>
  <Form @submit="updateMaintenance" :validation-schema="formSchemaMaintenance">
    <div
      v-if="!maintenanceStore.isLoading"
      class="w-full bg-white p-5 rounded-md"
    >
      <div class="flex justify-between items-center mb-5">
        <div class="w-full">
          <label for="name" class="font-semibold text-[#dc2626]"
            >Yêu cầu bảo trì</label
          >
          <Field
            type="text"
            name="title"
            id="title"
            class="input-maintenance w-auto pl-2"
            placeholder="VD: Màn hình không hoạt động"
            :disabled="maintenanceStatus === 'COMPLETED'"
            v-model="data.title"
          >
          </Field>
          <ErrorMessage name="title" class="error" />
        </div>
      </div>
      <span class="font-semibold">Thông tin bảo trì:</span>
      <div class="flex justify-between">
        <div class="grid grid-cols-1 w-1/2">
          <div class="flex items-center mb-4">
            <label for="serialNumber" class="label-custom mr-2"
              >Thiết bị:</label
            >
            <button
              @click="openDeviceDialog"
              class="bg-[#1d8826] text-white p-2 rounded-md"
              :hidden="maintenanceStatus === 'COMPLETED'"
            >
              Chọn thiết bị
            </button>
          </div>
          <ul v-if="device" class="mb-2">
            <li class="text-sm font-semibold">Thông tin thiết bị:</li>
            <li class="p-1">
              Tên: {{ device.name }}({{ device.serialNumber }})
            </li>
            <li class="p-1">Loại: {{ device.category.categoryName }}</li>
            <li v-if="device.roomId" class="p-1">
              Địa điểm: {{ device.room?.roomName }} /
              {{ device.room?.deparment.deparmentName }} ({{
                device.room?.deparment.symbol
              }})
            </li>
            <li v-else class="p-1">
              Địa điểm: {{ roomParent.roomName }} /
              {{ roomParent.deparment.deparmentName }} ({{
                roomParent.deparment.symbol
              }})
            </li>
          </ul>
        </div>
        <div class="grid grid-cols-1 w-1/2">
          <div class="flex items-center mb-5 p-1">
            <label for="user" class="label-custom mr-8">Người phụ trách:</label>

            <div
              v-if="
                maintenanceStatus == 'APPROVED' ||
                maintenanceStatus == 'COMPLETED'
              "
              class="w-[70%]"
            >
              <Field
                as="select"
                name="userId"
                id="user"
                class="input-device pl-2"
                v-model="data.userId"
                disabled
              >
                <option value="">Chọn nhân viên</option>
                <option
                  v-for="user in userStore.users"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }} ({{ user.employeeId }})
                </option>
              </Field>
              <ErrorMessage name="userId" class="error" />
            </div>
            <div v-else class="w-[70%]">
              <Field
                as="select"
                name="userId"
                id="user"
                class="input-device pl-2"
                v-model="data.userId"
                :disabled="maintenanceStatus === 'COMPLETED'"
              >
                <option value="">Chọn nhân viên</option>
                <option
                  v-for="user in userStore.users"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.name }} ({{ user.employeeId }})
                </option>
              </Field>
              <ErrorMessage name="userId" class="error" />
            </div>
          </div>
          <div class="flex items-center mb-5 p-1">
            <label for="startDate" class="label-custom mr-4"
              >Ngày theo kế hoạch:</label
            >
            <div class="w-[70%]">
              <Field
                type="date"
                name="startDate"
                id="startDate"
                class="input-device w-auto"
                v-model="data.startDate"
                :disabled="maintenanceStatus === 'COMPLETED'"
              >
              </Field>
              <ErrorMessage name="startDate" class="error" />
            </div>
          </div>
          <div class="flex items-center mb-5 p-1">
            <label for="expirationDate" class="label-custom mr-[96px]"
              >Thời hạn:</label
            >
            <div class="w-[70%]">
              <Field
                type="date"
                name="endDate"
                id="endDate"
                class="input-device w-auto"
                v-model="data.endDate"
                :disabled="maintenanceStatus === 'COMPLETED'"
              >
              </Field>
              <ErrorMessage name="endDate" class="error" />
            </div>
          </div>
          <div class="flex items-center mb-5 p-1">
            <label for="priority" class="label-custom mr-6 mt-2"
              >Mức độ ưu tiên:</label
            >
            <div class="w-[70%]">
              <Rating
                id="priority"
                v-model="value"
                :cancel="false"
                :stars="3"
                class="rating-custom"
                :disabled="maintenanceStatus === 'COMPLETED'"
              />
              <!-- Tooltip section -->
            </div>
            <div>
              <Tag
                class="w-[120px] p-1"
                :value="getValue(maintenanceStatus)"
                :severity="getSeverity(maintenanceStatus)"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <fwb-textarea
          v-model="data.descriptionPlan"
          :rows="5"
          label="Ghi chú"
          placeholder="/"
        />
      </div>
      <div class="flex gap-2 justify-end mt-2">
        <button
          type="submit"
          class="bg-[#15803d] px-4 py-2 text-white rounded-md hover:opacity-85"
          :disabled="maintenanceStatus === 'COMPLETED'"
        >
          <i class="fa-solid fa-retweet mr-1"></i> Lưu
        </button>
      </div>
    </div>
    <div v-else class="absolute top-[50%] right-[50%]">
      <Loading />
    </div>
  </Form>
  <Dialog
    v-model:visible="dialogVisible"
    header="Chọn thiết bị"
    :style="{ width: '75vw' }"
    maximizable
    modal
    :contentStyle="{ height: '450px' }"
  >
    <DataTable
      :value="deviceStore.result"
      size="small"
      dataKey="id"
      removableSort
      scrollable
      paginator
      :rows="7"
      tableStyle="min-width: 40rem"
      v-model:selection="selectedDevices"
      class="p-5"
      v-model:filters="filters"
      :globalFilterFields="[
        'name',
        'room.roomName',
        'room.deparment.deparmentName',
      ]"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <IconField class="border border-gray-300 rounded m-2 right-0">
            <InputIcon class="relative">
              <i class="pi pi-search ml-4" />
            </InputIcon>
            <InputText
              v-model="filters['global'].value"
              class="p-1 border-none w-[200px]"
              placeholder="Tìm kiếm..."
            />
          </IconField>
        </div>
      </template>
      <template #empty>
        <div class="text-center">Không có thiết bị</div>
      </template>
      <Column
        selectionMode="single"
        headerStyle="width: 3rem"
        class="p-2"
      ></Column>
      <Column field="name" header="Tên thiết bị" sortable class="p-2"></Column>
      <Column field="serialNumber" header="Serial" sortable></Column>
      <Column
        field="room.deparment.deparmentName"
        header="Khoa"
        sortable
      ></Column>
      <Column field="room.roomName" header="Phòng" sortable></Column>
      <Column field="category.categoryName" header="Danh mục" sortable></Column>
    </DataTable>
    <template #footer>
      <Button
        label="Xác nhận"
        icon="pi pi-check mr-2"
        @click="confirmSelection(setFieldValue)"
        class="p-2 mr-5 mb-2"
        raised
      />
    </template>
  </Dialog>
</template>
