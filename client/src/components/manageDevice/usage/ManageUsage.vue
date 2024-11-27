<script setup>
import { ref, onMounted } from "vue";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import { useDeviceStore } from "@/stores/device.store";
import Column from "primevue/column";
import { useRouter } from "vue-router";
import Badge from "primevue/badge";
import Tag from "primevue/tag";
import { useLocationStore } from "@/stores/location.store";
const locationStore = useLocationStore();

const usagesInfo = ref();
onMounted(async () => {
  await locationStore.getUsageInfo();
  usagesInfo.value = locationStore.usages;
  console.log(usagesInfo.value);
});

const router = useRouter();
const expandedRows = ref([]);
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-10 text-[#25861e]">Quản lý sử dụng</h1>
  </div>
  <div class="card background-manage">
    <DataTable
      v-model:expandedRows="expandedRows"
      :value="usagesInfo"
      dataKey="id"
      scrollable
      scrollHeight="550px"
      tableStyle="min-width: 60rem"
      size="small"
    >
      <Column expander style="width: 5rem" class="text-center p-1" />
      <Column field="deparmentName" header="Trường-Khoa-Nhà học"></Column>
      <Column header="Kí hiệu">
        <template #body="slotProps" class="">
          <Tag
            class="w-[30px] ml-2 text-center text-white"
            severity="success"
            :value="slotProps.data.symbol"
          />
        </template>
      </Column>
      <Column field="roomCount" header="Tổng phòng" class="">
        <template #body="slotProps" class="">
          <Badge
            class="text-white ml-5"
            :value="slotProps.data.roomCount"
            severity="info"
          ></Badge>
        </template>
      </Column>
      <Column field="roomCount" header="Tổng thiết bị" class="">
        <template #body="slotProps" class="">
          <Badge
            class="text-white ml-5"
            :value="slotProps.data.totalDevices"
            severity="contrast"
          ></Badge>
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="p-5 border-b border-gray-400">
          <h5>Danh sách phòng {{ slotProps.data.deparmentName }}</h5>
          <DataTable :value="slotProps.data.rooms" size="small">
            <div v-if="slotProps.data.rooms == ''">
              <p class="text-center text-blue-500">Hiện chưa có phòng</p>
            </div>
            <div v-else>
              <Column field="id" header="Id" class="p-2"></Column>
              <Column field="roomName" header="Tên phòng" sortable></Column>
              <Column
                field="deviceStatusCounts.active"
                header="Số thiết bị hoạt động"
                sortable
              >
                <template #body="slotProps">
                  <Badge
                    class="text-white ml-20"
                    :value="slotProps.data.deviceStatusCounts.active ?? 0"
                    severity="success"
                  ></Badge>
                </template>
              </Column>
              <Column
                field="deviceStatusCounts.maintenance"
                header="Số thiết đang bảo trì"
                sortable
              >
                <template #body="slotProps">
                  <Badge
                    class="text-white ml-20"
                    :value="slotProps.data.deviceStatusCounts.maintenance ?? 0"
                    severity="danger"
                  ></Badge>
                </template>
              </Column>
              <!-- <Column header="Số thiết cần bảo trì">
                <template #body="slotProps">
                  <Badge
                    class="text-white ml-5"
                    :value="
                      slotProps.data.deviceStatusCounts.needMaintenance ?? 0
                    "
                    severity="warning"
                  ></Badge>
                </template>
              </Column> -->
              <Column header="Tổng">
                <template #body="slotProps">
                  <Badge
                    class="text-white ml-5"
                    :value="slotProps.data.deviceStatusCounts.total ?? 0"
                    severity="contrast"
                  ></Badge>
                </template>
              </Column>

              <Column field="id" headerStyle="width:2rem">
                <template #body="slotProps">
                  <Button
                    icon="pi pi-search"
                    class="bg-green-600 text-white py-1"
                    @click="
                      () => {
                        router.push({
                          name: 'detailUsage',
                          params: { id: slotProps.data.id },
                          query: { roomName: slotProps.data.roomName },
                        });
                      }
                    "
                  />
                </template>
              </Column>
            </div>
          </DataTable>
        </div>
      </template>
    </DataTable>
  </div>
</template>
