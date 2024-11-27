<script setup>
import { ref, onMounted, watchEffect } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useHistoryStore } from "@/stores/history.store";
import dayjs from "dayjs";
import SearchHistory from "@/components/common/SearchHistory.vue";
const historyStore = useHistoryStore();
const maintenances = ref();
onMounted(async () => {
  await historyStore.getHistoryMaintenance({});
  maintenances.value = historyStore.maintenances;
  console.log(maintenances.value);
});
watchEffect(async () => {
  await historyStore.getHistoryMaintenance({
    key: historyStore.key,
  });
  maintenances.value = historyStore.maintenances;
});
const expandedRows = ref([]);
</script>
<style scoped>
.p-datatable-thead th,
.p-datatable-tbody td {
  position: static !important; /* Đảm bảo vị trí không còn sticky */
}
</style>
<template>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold mb-10 text-[#25861e]">
        Lịch sử bảo trì <i class="fa-solid fa-clock-rotate-left ml-2"></i>
      </h1>
      <p class="mb-2 text-red-600">Lưu ý: Đây là những bảo trì đã hoàn thành</p>
    </div>

    <SearchHistory
      class="border border-gray-400 bg-white"
      :title="'Tìm kiếm thiết bị'"
      @key="
        (e) => {
          historyStore.key = e;
        }
      "
    />
  </div>

  <div class="card">
    <DataTable
      v-model:expandedRows="expandedRows"
      :value="maintenances"
      dataKey="id"
      scrollable
      scrollHeight="550px"
      tableStyle="min-width: 60rem"
      size="small"
    >
      <Column expander style="width: 5rem" class="text-center p-1" />
      <Column field="name" header="Tên thiết bị"></Column>
      <Column field="serialNumber" header="serialNumber"> </Column>
      <Column field="manufacturer" header="Nhà sản xuất" class=""> </Column>
      <Column field="category.categoryName" header="Loại thiết bị" class="">
      </Column>
      <template #expansion="slotProps">
        <div class="p-5 border-b border-gray-400">
          <h5>Lịch sử bảo trì {{ slotProps.data.name }}</h5>
          <DataTable :value="slotProps.data.maintenancePlan" size="small">
            <div>
              <Column field="id" header="Id" class="p-2"></Column>
              <Column field="title" header="Chủ đề" sortable></Column>
              <Column header="Phòng">
                <template #body="slotProps">
                  <span
                    >{{ slotProps.data.Room.roomName }}/{{
                      slotProps.data.Room.deparment.symbol
                    }}</span
                  >
                </template>
              </Column>
              <Column header="Ngày bắt đầu">
                <template #body="slotProps">
                  <span>{{
                    dayjs(slotProps.data.startDate).format("DD/MM/YYYY")
                  }}</span>
                </template>
              </Column>
              <Column header="Ngày hết hạn">
                <template #body="slotProps"
                  ><span>{{
                    dayjs(slotProps.data.endDate).format("DD/MM/YYYY")
                  }}</span>
                </template>
              </Column>
              <Column header="Người phụ trách">
                <template #body="slotProps">
                  <span>
                    {{ slotProps.data.User.name }}/({{
                      slotProps.data.User.employeeId
                    }})
                  </span>
                </template>
              </Column>
            </div>
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>
</template>
