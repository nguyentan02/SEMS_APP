<script setup>
import { onMounted, ref } from "vue";
import { useUsageStore } from "@/stores/usage.store";
import { useRoute } from "vue-router";
import DataTable from "primevue/datatable";
import EditUsageModal from "./EditUsageModal.vue";
import { FwbBreadcrumb, FwbBreadcrumbItem } from "flowbite-vue";
import Tag from "primevue/tag";
import Column from "primevue/column";
import RotationDevice from "../transfer/RotationDevice.vue";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import { useToast } from "vue-toast-notification";
import Dialog from "primevue/dialog";
import { useRouter } from "vue-router";
const visible = ref(false);
const $toast = useToast();
import Button from "primevue/button";
import dayjs from "dayjs";
import Loading from "@/components/common/Loading.vue";
import Toolbar from "primevue/toolbar";
import AddUsageModal from "./AddUsageModal.vue";
import { useRotationDevice } from "@/stores/rotation.store";
import { useDeviceStore } from "@/stores/device.store";
import InputText from "primevue/inputtext";
const usageStore = useUsageStore();
const currentUsage = ref(null);
const currentDevice = ref(null);
const currentRoomName = ref(null);
const usageId = ref(null);
const route = useRoute();
const router = useRouter();
const deviceStore = useDeviceStore();
const roomId = route.params.id;
const roomName = route.query.roomName;
const rotationStore = useRotationDevice();
onMounted(async () => {
  await usageStore.getUsageByIdRoom(roomId);
});
const selectedDevices = ref([]);
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

const deleteUsage = async (id) => {
  console.log(id);
  await usageStore.deleteUsage(id);
  if (usageStore.err) {
    $toast.error(usageStore.err, { position: "top-right" });
    return;
  }
  $toast.success(usageStore.result.message, { position: "top-right" });
  await usageStore.getUsageByIdRoom(roomId);
  await deviceStore.getDevicesByUsage();
  visible.value = false;
};
const viewDeviceDetails = (event) => {
  const deviceId = event.data.Device.id;
  router.push({
    name: "detailDeivce",
    params: { id: deviceId },
  });
};
const filters = ref();
const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    usage_start: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    price: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  };
};
initFilters();
const dt = ref();
const exportCSV = () => {
  dt.value.exportCSV();
};
const statuses = ref(["ĐANG HOẠT ĐỘNG", "ĐANG BẢO TRÌ"]);
const formatDate = (value) => {
  return dayjs(value).format("DD/MM/YYYY HH:MM:ss");
};
// const formatDate = (value) => {
//   return value.toLocaleDateString("en-US", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
//   });
// };
</script>
<style scoped></style>

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
    >
      Trở về
    </fwb-breadcrumb-item>
    <fwb-breadcrumb-item> Phòng {{ roomName }} </fwb-breadcrumb-item>
  </fwb-breadcrumb>
  <div>
    <h1 class="text-2xl font-bold mb-10 text-[#25861e]">
      Danh sách thiết bị của phòng {{ roomName }}
    </h1>
  </div>
  <Toolbar class="mb-4 px-2 py-3 rounded-md">
    <template #start>
      <Button
        label="Mới"
        icon="pi pi-plus"
        outlined
        class="mr-2 px-2 py-1 bg-[#25861e] text-white"
        @click="
          () => {
            usageStore.showAddUsage();
            currentRoomId = roomId;
          }
        "
      />
      <Button
        icon="pi pi-send"
        :disabled="selectedDevices.length === 0"
        class="mr-2 px-4 py-1 bg-[#3089dd] text-white rounded-lg"
        @click="
          () => {
            rotationStore.showRotationDevice();
            currentRoomName = roomName;
            currentDevice = selectedDevices.map((device) => device.deviceId);
          }
        "
      />
    </template>
    <template #end>
      <Button
        label="Xuất tập tin"
        @click="exportCSV($event)"
        icon="pi pi-upload"
        severity="help"
      />
    </template>
  </Toolbar>
  <div v-if="!usageStore.isLoading" class="card background-manage">
    <DataTable
      ref="dt"
      v-model:filters="filters"
      :globalFilterFields="['Device.name', 'Device.serialNumber']"
      :value="usageStore.usages"
      paginator
      :rows="10"
      dataKey="id"
      filterDisplay="menu"
      v-model:selection="selectedDevices"
      @row-click="viewDeviceDetails"
    >
      <template #header>
        <div class="flex flex-wrap gap-2 items-center justify-between">
          <h4 class="p-3">Danh sách thiết bị</h4>
          <IconField class="border border-gray-300 rounded mr-2">
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
      <Column
        selectionMode="multiple"
        headerStyle="width: 3rem"
        class="p-2"
      ></Column>
      <template #empty>
        <div class="text-center">Không có thiết bị</div>
      </template>
      <div class="">
        <Column
          header="Name"
          field="Device.name"
          sortable
          style="min-width: 6rem"
          class="p-2 border-b border-gray-400"
          frozen
        >
        </Column>
        <Column
          header="Serial"
          field="Device.serialNumber"
          style="min-width: 6rem"
          class="p-2 border-b border-gray-400"
        >
        </Column>
        <Column
          header="Loại"
          sortable
          field="Device.category.categoryName"
          style="min-width: 8rem"
          class="p-2 border-b border-gray-400"
        >
        </Column>
        <Column
          header="Hình ảnh"
          style="min-width: 8rem"
          class="border-b border-gray-400"
        >
          <template #body="{ data }">
            <div class="flex align-items-center gap-2">
              <img alt="flag" :src="data.Device.image" style="width: 50px" />
            </div>
          </template>
        </Column>
        <Column
          header="Ngày bắt đầu"
          field="usage_start"
          sortable
          style="min-width: 12rem"
          class="border-b border-gray-400"
          filterField="usage_start"
        >
          <template #body="{ data }">
            {{ formatDate(data.usage_start) }}
          </template>
        </Column>
        <Column
          header="Ngày hết hạn"
          field="usage_end"
          sortable
          style="min-width: 12rem"
          class="border-b border-gray-400"
        >
          <template #body="{ data }">
            {{ dayjs(data.usage_end).format("DD/MM/YYYY HH:MM:ss") }}
          </template>
        </Column>
        <Column
          header="Ghi chú"
          style="min-width: 8rem"
          class="border-b border-gray-400"
        >
          <template #body="{ data }">
            <p>{{ data.purpose }}</p>
          </template>
        </Column>

        <Column
          header="Trạng thái"
          sortable
          style="min-width: 5rem"
          class="border-b border-gray-400"
          field="Device.statusDevice"
        >
          >
          <template #body="{ data }">
            <Tag
              class="p-1"
              :value="data.Device.statusDevice"
              :severity="getSeverity(data.Device.statusDevice)"
            />
          </template>
        </Column>

        <Column
          :exportable="false"
          style="min-width: 2rem"
          class="border-b border-gray-400"
        >
          <template #body="{ data }">
            <div class="flex">
              <Button
                icon="pi pi-pencil"
                outlined
                rounded
                class="text-emerald-600 border border-emerald-600 size-9 mr-1"
                @click="
                  () => {
                    usageStore.showEditUsage();
                    currentUsage = data;
                  }
                "
              />

              <Button
                icon="pi pi-trash"
                @click="
                  () => {
                    visible = true;
                    usageId = data.id;
                  }
                "
                outlined
                rounded
                class="text-red-600 border border-red-600 size-9"
              />
            </div>
          </template>
        </Column>
        <Dialog
          v-model:visible="visible"
          modal
          position="top"
          header="Xoá"
          class="mt-2"
          :style="{ width: '20rem' }"
        >
          <span class="text-surface-500 dark:text-surface-400 block mb-8 p-2"
            ><i class="fa-solid fa-triangle-exclamation"></i>Bạn có muốn xóa bản
            ghi này không?</span
          >

          <div class="flex justify-end gap-2 m-2">
            <Button
              type="button"
              label="Trở về"
              severity="secondary"
              class="px-2"
              @click="visible = false"
            ></Button>
            <Button
              type="button"
              label="Xoá"
              severity="danger"
              class="px-4"
              @click="deleteUsage(usageId)"
            ></Button>
          </div>
        </Dialog>
      </div>
    </DataTable>
  </div>
  <div v-else class="absolute right-[47%]">
    <Loading />
  </div>
  <AddUsageModal />
  <RotationDevice
    :selectedDevices="currentDevice"
    :currentRoomName="currentRoomName"
  />
  <EditUsageModal :currentUsage="currentUsage" />
</template>
