<script setup>
import { onMounted, ref, onBeforeUnmount, watchEffect } from "vue";
import { FwbButton, FwbPagination } from "flowbite-vue";
import SeachDevice from "@/components/common/SeachDevice.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Tag from "primevue/tag";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { useMaintenanceStore } from "@/stores/maintenance.store";
import DetailMainance from "./DetailMainance.vue";
import Loading from "@/components/common/Loading.vue";
const maintenanceStore = useMaintenanceStore();
const maintenanceEdit = ref(null);
const isFilterOpen = ref(false);
const filterContainer = ref(null);
const maintenanceId = ref(null);
const router = useRouter();
onMounted(async () => {
  await maintenanceStore.getMaitenancesByTech({});
  console.log(maintenanceStore.maintenances);
  document.addEventListener("click", handleClickOutside);
});
watchEffect(async () => {
  await maintenanceStore.getMaitenancesByTech({
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
const handleRowClick = async (event) => {
  maintenanceId.value = event.data.id;
  await maintenanceStore.getMaitenanceById(maintenanceId.value);
  maintenanceEdit.value = maintenanceStore.maintenance;
  maintenanceStore.showDetail();
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
  <div class="flex items-center justify-end">
    <!-- <div class="relative w-[20%]">
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
    </div> -->

    <div
      class="relative right-0 flex border border-gray-500 rounded-lg"
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
      <button
        @click="toggleFilter"
        class="px-4 border-l border-l-gray-500"
        :class="{ background: isFilterOpen }"
      >
        <i
          class="fa-solid fa-caret-down transition-transform duration-300 ease-in-out"
          :class="{ 'rotate-180': isFilterOpen }"
        ></i>
      </button>
      <div
        v-if="isFilterOpen"
        class="absolute bg-white border right-0 mt-10 w-[630px] z-10 shadow-lg transition-opacity duration-300 ease-in-out rounded-md"
        :class="{ 'opacity-100': isFilterOpen, 'opacity-0': !isFilterOpen }"
      >
        <div class="grid grid-cols-2 divide-x divide-gray-200">
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
                <input type="checkbox" class="mr-2" />
                Danh mục sản phẩm
              </label>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="!maintenanceStore.isLoading" class="card mt-8">
    <DataTable
      :value="maintenanceStore.maintenances"
      removableSort
      tableStyle="min-width: 50rem"
      :rowHover="true"
      @row-click="handleRowClick"
    >
      <template #empty>
        <div class="text-center">Không có yêu cầu bảo trì</div>
      </template>
      <Column field="id" header="ID" class="p-3" sortable></Column>
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
              {{ data.Room.roomName }}/{{ data.Room.deparment.symbol }}
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
        <template #body="{ data }" class="">
          {{ getPriority(data.priority) }}
        </template></Column
      >
      <Column field="maintenanceStatus" header="Tiến độ" sortable>
        <template #body="{ data }">
          <Tag
            class="w-[120px] p-1"
            :value="getValue(data.maintenanceStatus)"
            :severity="getSeverity(data.maintenanceStatus)"
          /> </template
      ></Column>
    </DataTable>
  </div>
  <div v-else class="absolute top-[30%] right-[47%]">
    <Loading />
  </div>
  <DetailMainance :maintenanceEdit="maintenanceEdit" />
</template>
