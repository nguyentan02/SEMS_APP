<script setup>
import { onMounted, ref, onBeforeUnmount, watchEffect } from "vue";
import { FwbButton, FwbPagination } from "flowbite-vue";
import SeachDevice from "../common/SeachDevice.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { useMaintenanceStore } from "@/stores/maintenance.store";
import Loading from "../common/Loading.vue";
const maintenanceStore = useMaintenanceStore();
const isFilterOpen = ref(false);
const filterContainer = ref(null);
const router = useRouter();
onMounted(async () => {
  await maintenanceStore.getMaitenances({ key: "" });
  document.addEventListener("click", handleClickOutside);
  console.log(maintenanceStore.maintenances);
});
watchEffect(async () => {
  await maintenanceStore.getMaitenances({
    key: maintenanceStore.key,
  });
});
const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value;
};
const handleClickOutside = (event) => {
  if (filterContainer.value && !filterContainer.value.contains(event.target)) {
    isFilterOpen.value = false;
  }
};
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
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
const viewMaintenaceDetails = (event) => {
  const maintenanceId = event.data.id;
  router.push({
    name: "editmaintenance",
    params: { id: maintenanceId },
  });
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
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
.background {
  color: #111827;
  background-color: #e6f2f3;
}
</style>
<template>
  <h1 class="text-2xl font-bold mb-10 text-[#25861e]">Yêu cầu bảo trì</h1>
  <div class="flex items-center justify-between">
    <div class="relative w-[20%]">
      <fwb-button
        color="green"
        size="sm"
        class="font-semibold px-4 py-2"
        @click="
          () => {
            router.push({
              name: 'newmaintenance',
            });
          }
        "
        >Mới
        <i class="fa-solid fa-plus"></i>
      </fwb-button>
    </div>

    <div
      class="relative flex border border-gray-500 rounded-lg"
      ref="filterContainer"
    >
      <div class="">
        <SeachDevice
          :title="'Tìm kiếm...'"
          @key="
            (e) => {
              maintenanceStore.key = e;
            }
          "
        />
      </div>
      <!-- <button
        @click="toggleFilter"
        class="px-4 border-l border-l-gray-500"
        :class="{ background: isFilterOpen }"
      >
        <i
          class="fa-solid fa-caret-down transition-transform duration-300 ease-in-out"
          :class="{ 'rotate-180': isFilterOpen }"
        ></i>
      </button> -->
      <!-- <div
        v-if="isFilterOpen"
        class="absolute bg-white border right-0 mt-10 w-[330px] z-10 shadow-lg transition-opacity duration-300 ease-in-out rounded-md"
        :class="{ 'opacity-100': isFilterOpen, 'opacity-0': !isFilterOpen }"
      >
        <div class="grid grid-cols-1 divide-x divide-gray-200">
          <div class="p-4">
            <span class="font-semibold text-gray-800 mb-2"
              ><i class="fa-solid fa-filter text-fuchsia-800 mr-2"></i>Bộ
              lọc</span
            >
            <ul class="text-gray-600 space-y-2"></ul>
          </div>
          <div class="p-4">
            <span class="font-semibold text-gray-800 mb-2">
              <i class="fa-solid fa-layer-group text-green-500 mr-2"></i>Nhóm
              theo</span
            >
            <ul class="text-gray-600 space-y-2">
              <label class="cursor-pointer hover:text-blue-600">
                <input  type="checkbox" class="mr-2" />
                Phân công cho
              </label>
            </ul>
          </div>
        </div>
      </div> -->
    </div>
  </div>
  <div v-if="!maintenanceStore.isLoading" class="card mt-8">
    <DataTable
      :value="maintenanceStore.maintenances"
      removableSort
      paginator
      :rows="10"
      tableStyle="min-width: 50rem"
      :rowHover="true"
      @row-click="viewMaintenaceDetails"
    >
      <template #empty>
        <p class="text-center">Không có</p>
      </template>
      <Column field="title" header="Chủ đề" class="p-3" sortable></Column>
      <Column
        field="Device.name"
        header="Thiết bị"
        class="p-3"
        sortable
      ></Column>
      <Column header="Phòng" class="p-3">
        <template #body="{ data }">
          <div>
            <p class="font-semibold">
              {{ data.Room?.roomName }}/{{ data.Room?.deparment.symbol }}
            </p>
          </div>
        </template>
      </Column>
      <Column field="User.employeeId" header="Kỹ thuật viên" sortable>
        <template #body="{ data }">
          <div>
            <p class="font-semibold">
              {{ data.User.name }}/{{ data.User.employeeId }}
            </p>
          </div>
        </template>
      </Column>
      <Column field="startDate" header="Ngày bắt đầu" sortable>
        <template #body="{ data }">
          {{ dayjs(data.startDate).format("DD/MM/YYYY HH:MM:ss") }}
        </template></Column
      >
      <Column field="endDate" header="Ngày hết hạn" sortable>
        <template #body="{ data }">
          {{ dayjs(data.endDate).format("DD/MM/YYYY HH:MM:ss") }}
        </template></Column
      >
      <Column field="priority" header="Độ ưu tiên" sortable>
        <template #body="{ data }">
          {{ getPriority(data.priority) }}
        </template></Column
      >
      <Column field="maintenanceStatus" header="Giai đoạn" sortable>
        <template #body="{ data }">
          <Tag
            class="w-[100px] p-1"
            :value="getValue(data.maintenanceStatus)"
            :severity="getSeverity(data.maintenanceStatus)"
          /> </template
      ></Column>
    </DataTable>
    
  </div>
  <div v-else class="absolute top-[30%] right-[47%]">
    <Loading />
  </div>
</template>
