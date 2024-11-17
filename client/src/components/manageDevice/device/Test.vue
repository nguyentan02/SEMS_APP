<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";

import { useDeviceStore } from "@/stores/device.store";

import Column from "primevue/column";
import DataTable from "primevue/datatable";

import dayjs from "dayjs";

const deviceStore = useDeviceStore();

const expandedRows = ref([]);
const historys = ref();

onMounted(async () => {
  await deviceStore.getDevices({ name: "", groupByCategory: true });
  historys.value = deviceStore.devices;
});

const formatDate = (date) => {
  return dayjs(date).format("DD/MM/YYYY HH:MM:ss");
};
</script>
<template>
  <div>
    <h1 class="text-xl font-bold pl-4">Lịch sử luân chuyển của các thiết bị</h1>
  </div>
  <div class="card">
    <DataTable
      v-model:expandedRows="expandedRows"
      @row-toggle="(e) => (expandedRows.value = e.data)"
      :value="historys"
      :rowKey="(category) => category.categoryName"
    >
      <Column expander style="width: 2rem" />
      <Column field="categoryName" header="Danh mục thiết bị"></Column>
      <template #expansion="slotProps">
        <div class="p-2">
          <!-- <h5 class="font-semibold">
            Danh sách của {{ slotProps.categoryName }}
          </h5> -->
          <DataTable
            :value="slotProps.data.devices"
            :rowKey="(device) => device.id"
          >
            <Column header="Tên thiết bị" field="name" />
            <Column field="purchaseDate" header="Ngày Mua">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.purchaseDate) }}
              </template>
            </Column>
            <!-- <Column field="user" header="Phòng / Khoa mới">
              <template #body="slotProps">
                <span>
                  {{ slotProps.data.NewRoom.room_name }} /
                  {{ slotProps.data.NewRoom.deparment.deparment_name }}
                </span>
              </template>
            </Column>
            <Column field="usage_start" header="Thời gian luân chuyển">
              <template #body="slotProps">
                {{ formatDate(slotProps.data.transferDate) }}
              </template>
            </Column> -->
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>
</template>
