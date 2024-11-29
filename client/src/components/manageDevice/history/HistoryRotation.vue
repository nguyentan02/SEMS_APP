<script setup>
import { ref, onMounted, watchEffect } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { useHistoryStore } from "@/stores/history.store";
import dayjs from "dayjs";
import SearchHistory from "@/components/common/SearchHistory.vue";
const historyStore = useHistoryStore();
const rotations = ref();
onMounted(async () => {
  await historyStore.getRotationHistory({});
  rotations.value = historyStore.rotations;
});
watchEffect(async () => {
  await historyStore.getRotationHistory({
    key: historyStore.key,
  });
  rotations.value = historyStore.rotations;
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
        Lịch sử luân chuyển <i class="fa-solid fa-clock-rotate-left ml-2"></i>
      </h1>
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
      :value="rotations"
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
          <DataTable :value="slotProps.data.RotationDevice" size="small">
            <div>
              <Column field="id" header="Id" class="p-2"></Column>
              <Column header="Phòng cũ">
                <template #body="slotProps">
                  <span
                    >{{ slotProps.data.OldRoom.roomName }}/{{
                      slotProps.data.OldRoom.deparment.symbol
                    }}</span
                  >
                </template>
              </Column>
              <Column header="Phòng mới">
                <template #body="slotProps">
                  <span
                    >{{ slotProps.data.NewRoom.roomName }}/{{
                      slotProps.data.NewRoom.deparment.symbol
                    }}</span
                  >
                </template>
              </Column>
              <Column header="Thời gian luân chuyển">
                <template #body="slotProps"
                  ><span>
                    {{
                      dayjs(slotProps.data.transferDate).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )
                    }}
                  </span>
                </template>
              </Column>
              <Column header="Lý do">
                <template #body="slotProps">
                  <span>{{ slotProps.data.reason }} </span>
                </template>
              </Column>
            </div>
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>
</template>
