<script setup>
import { useUsageStore } from "@/stores/usage.store";
import { useDeviceStore } from "@/stores/device.store";
import { onMounted, reactive, ref } from "vue";
import { FwbButton, FwbModal, FwbTextarea } from "flowbite-vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import Dialog from "primevue/dialog";
import { useRoute } from "vue-router";
import * as yup from "yup";
import { useToast } from "vue-toast-notification";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
const props = defineProps(["roomId"]);
const route = useRoute();
const roomIdTest = route.params.id;
const newUsage = reactive({
  deviceId: [],
  roomId: roomIdTest,
  purpose: "",
});

const usageStore = useUsageStore();
const deviceStore = useDeviceStore();
const $toast = useToast();
const device = ref([]);
const dialogVisible = ref(false);
const selectedDevices = ref([]);
// const formSchemaUsage = yup.object().shape({
//   usage_start: yup.string().required("Vui lòng chọn ngày."),
//   usage_end: yup.string().required("Vui lòng chọn ngày."),
// });

onMounted(async () => {
  await deviceStore.getDevicesByUsage();
});

const confirmSelection = () => {
  newUsage.deviceId = selectedDevices.value.map((device) => device.id);
  dialogVisible.value = false;
};
const addUsage = async () => {
  await usageStore.createUsage(newUsage);
  if (usageStore.err && usageStore.code == 400) {
    $toast.error(usageStore.err, { position: "top-right" });
    return;
  } else if (usageStore.err && usageStore.code == 422) {
    $toast.warning(usageStore.err, { position: "top-right" });
    return;
  } else {
    $toast.success(usageStore.result.message, { position: "top-right" });
  }

  newUsage.deviceId = [];
  newUsage.purpose = "";
  selectedDevices.value = [];
  usageStore.closeAddUsage();
  await usageStore.getUsageByIdRoom(roomIdTest);
  await deviceStore.getDevicesByUsage();
};
</script>

<template>
  <Form
    v-if="usageStore.isShow.addUsage"
    @submit="addUsage"
    v-slot="{ setFieldValue }"
  >
    <fwb-modal @close="usageStore.closeAddUsage" :persistent="true">
      <template #header>
        <div class="flex items-center text-lg">Thêm thiết bị vào phòng học</div>
      </template>
      <template #body>
        <Button
          label="Chọn thiết bị"
          icon="pi pi-external-link"
          class="p-1 bg-[#1d7517]"
          @click="dialogVisible = true"
        />
        <div class="mt-2">
          <p class="py-2">
            Số thiết bị đã chọn: {{ selectedDevices.length }} thiết bị
          </p>
          <fwb-textarea
            v-model="newUsage.purpose"
            :rows="4"
            label="Ghi chú"
            placeholder="Viết ghi chú..."
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-between">
          <fwb-button color="green"> Thêm mới </fwb-button>
          <fwb-button @click="usageStore.closeAddUsage" color="red"
            >Hủy</fwb-button
          >
        </div>
      </template>
    </fwb-modal>
    <Dialog
      v-model:visible="dialogVisible"
      header="Chọn thiết bị"
      :style="{ width: '75vw' }"
      maximizable
      modal
      :contentStyle="{ height: '500px' }"
    >
      <DataTable
        :value="deviceStore.result"
        size="small"
        dataKey="id"
        removableSort
        scrollable
        paginator
        :rows="10"
        tableStyle="min-width: 40rem"
        v-model:selection="selectedDevices"
        class="ml-3"
      >
        <!-- Cột checkbox -->
        <Column
          selectionMode="multiple"
          headerStyle="width: 3rem"
          class="ml-2"
        ></Column>
        <Column
          field="name"
          header="Tên thiết bị"
          sortable
          style="width: 25%"
          class="p-2"
        ></Column>
        <Column
          field="serialNumber"
          header="Serial"
          sortable
          style="width: 25%"
        ></Column>
        <Column
          field="manufacturer"
          header="Nhà sản xuất"
          sortable
          style="width: 25%"
        ></Column>
        <Column
          field="category.categoryName"
          header="Danh mục"
          sortable
          style="width: 20%"
        ></Column>
      </DataTable>
      <template #footer>
        <Button
          label="Xác nhận"
          icon="pi pi-check"
          @click="confirmSelection(setFieldValue)"
          class="p-2 mr-5 mb-2"
          raised
        />
      </template>
    </Dialog>
  </Form>

  <!-- Dialog chọn thiết bị -->
</template>
