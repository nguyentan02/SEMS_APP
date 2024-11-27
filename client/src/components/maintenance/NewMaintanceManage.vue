<script setup>
import { onMounted, ref, reactive, watch } from "vue";
import { useUserStore } from "@/stores/user.store";
import { useDeviceStore } from "@/stores/device.store";
import { Form, Field, ErrorMessage } from "vee-validate";
import { FwbButton, FwbTextarea } from "flowbite-vue";
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
import { useRouter } from "vue-router";
import InputIcon from "primevue/inputicon";
import { useMaintenanceStore } from "@/stores/maintenance.store";
import Loading from "../common/Loading.vue";
const userStore = useUserStore();
const deviceStore = useDeviceStore();
const maintenanceStore = useMaintenanceStore();
const value = ref(1);
const $toast = useToast();
const dialogVisible = ref(false);
const selectedDevices = ref({});
const device = ref(null);
const router = useRouter();
onMounted(async () => {
  await userStore.getTechnical();
  await deviceStore.getDevicesByMaintenance();
  console.log(deviceStore.result);
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
    .min(5, "Tối thiểu 5 kí tự")
    .required("Không được bỏ trống."),
  userId: yup.string().required("Hãy chọn người phụ trách."),
  startDate: yup.string().required("Vui lòng chọn ngày bắt đầu."),
  endDate: yup.string().required("Vui lòng chọn thời hạn."),
});

const confirmSelection = () => {
  device.value = selectedDevices.value;
  data.deviceId = device.value.id;
  dialogVisible.value = false;
};
const createMaintenance = async () => {
  console.log(data);
  await maintenanceStore.createMaitenance(data);
  if (maintenanceStore.err) {
    $toast.error(maintenanceStore.err, { position: "top-right" });
    return;
  }
  $toast.success(maintenanceStore.result.message, { position: "top-right" });
  data.deviceId = "";
  data.title = "";
  data.userId = "";
  data.descriptionPlan = "";
  data.startDate = "";
  data.endDate = "";
  router.back();
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
const filters = ref();
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };
};
initFilters();
</script>

<template>
  <Form
    @submit="createMaintenance"
    :validation-schema="formSchemaMaintenance"
    v-slot="{ setFieldValue }"
  >
    <div class="flex items-center text-lg text-black"></div>
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
            v-model="data.title"
          >
          </Field>
          <ErrorMessage name="title" class="error" />
        </div>
      </div>
      <span class="font-semibold">Thông tin bảo trì:</span>
      <div class="flex justify-between">
        <div class="grid grid-cols-1 w-[30%] border-r">
          <div class="">
            <label for="serialNumber" class="label-custom mr-2 mt-2"
              >Thiết bị:</label
            >
            <button
              @click="dialogVisible = true"
              class="bg-[#1d8826] text-white p-2 rounded-md mt-4"
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
            <li class="p-1">
              Địa điểm: {{ device.room.roomName }} /
              {{ device.room.deparment.deparmentName }} ({{
                device.room.deparment.symbol
              }})
            </li>
          </ul>
          <!-- <div class="flex items-center mb-4">
            <label for="manufacturer" class="label-custom mr-2"
              >Ngày yêu cầu:</label
            >
            <div class="w-[70%]">
              <Field
                type="date"
                name="manufacturer"
                id="manufacturer"
                class="input-device w-auto"
              >
              </Field>
              <ErrorMessage name="manufacturer" class="error" />
            </div>
          </div> -->
        </div>
        <div class="grid grid-cols-1 w-[60%]">
          <div class="flex items-center mb-5 p-1">
            <label for="user" class="label-custom mr-8">Người phụ trách:</label>
            <div class="w-[70%]">
              <Field
                as="select"
                name="userId"
                id="user"
                class="input-device pl-2"
                v-model="data.userId"
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
              />
              <!-- Tooltip section -->
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
          class="bg-[#1d8826] px-4 py-2 text-white rounded-md hover:opacity-85"
        >
          Lưu
        </button>
        <button
          class="bg-[#d6d3d1] px-4 py-2 text-black rounded-md hover:opacity-85"
          @click="
            () => {
              router.back();
            }
          "
        >
          Huỷ
        </button>
      </div>
    </div>
    <div v-else>
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
