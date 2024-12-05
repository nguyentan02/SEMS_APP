<script setup>
import { ref } from "vue";
import { useToast } from "vue-toast-notification";
import { FwbButton } from "flowbite-vue";
import { useRouter } from "vue-router";
import { useDeviceStore } from "@/stores/device.store";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
const router = useRouter();
const $toast = useToast();
const fileInput = ref(null);

const deviceStore = useDeviceStore();
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};
const show = ref(false);
const file = ref(null);
const showDataTable = ref(false); 
const data = ref([]);
const container = ref(null);

const renderTable = () => {
  new Handsontable(container.value, {
    data: data.value,
    rowHeaders: true,
    colHeaders: true,
    height: 400, // Chiều cao cố định là 500px
    width: '100%', 
    columns: data.value[0]?.map((_, index) => ({
      type:
        index === 3 || index === 4 ? "date" : index === 5 ? "numeric" : "text",
      dateFormat: index === 3 || index === 4 ? "YYYY-MM-DD" : undefined,
      correctFormat: index === 3 || index === 4,
      numericFormat:
        index === 5
          ? {
              pattern: "0,0.00",
              culture: "en-US",
            }
          : undefined,
    })),
    licenseKey: "non-commercial-and-evaluation",
  });
};

const handleFileUpload = async (event) => {
  const uploadedFile = event.target.files[0];
  if (!uploadedFile) {
    $toast.warning("Vui lòng chọn một tệp để tải lên!", {
      position: "top-right",
    });
    return;
  }
  file.value = null;
  data.value = [];

  file.value = uploadedFile;
  show.value = true;
  data.value = await readExcelFile(uploadedFile);
  renderTable();
};

async function readExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      // Format ngày tháng
      jsonData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (typeof cell === "number" && rowIndex > 0) {
            const date = XLSX.SSF.parse_date_code(cell);
            if (date) {
              row[colIndex] = `${date.y}-${String(date.m).padStart(
                2,
                "0"
              )}-${String(date.d).padStart(2, "0")}`;
            }
          }
        });
      });
      resolve(jsonData);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
const createDevices = async () => {
  if (!file.value) return;
  const data = new FormData();
  data.append("file", file.value);
  await deviceStore.createDevices(data);
  if (deviceStore.err) {
    $toast.error(deviceStore.err, { position: "top-right" });
    return;
  }
  $toast.success(deviceStore.result.message, { position: "top-right" });
  file.value = null;
  showDataTable.value = true
  // router.back();
};

const back = () => {
  router.back();
};
</script>

<template>
  <div class="">
    <div class="flex items-center h-[40px]">
      <fwb-button class="ml-2 px-4 rounded-lg" @click="triggerFileInput"
        >Tải lên tệp</fwb-button
      >
      <input
        ref="fileInput"
        hidden
        id="excel"
        class="text-lime-600"
        type="file"
        accept=".xls, .xlsx"
        @change="handleFileUpload"
      />
      <div>
        <fwb-button
          class="ml-2 bg-gray-300 px-4 rounded-lg hover:bg-gray-300"
          @click="back"
        >
          Huỷ
        </fwb-button>
        <fwb-button
          v-if="show"
          class="ml-2 bg-lime-700 px-4 rounded-lg text-white hover:bg-gray-600"
          @click="createDevices"
        >
          Nhập
        </fwb-button>
      </div>

      <div class="ml-2 pb-2">
        <ol
          class="text-[13px] text-lime-800 font-semibold cursor-pointer"
          @click="back"
        >
          Thiết bị
        </ol>
        <span class="text-[14px]">Nhập một tệp</span>
      </div>
    </div>

    <div ref="container" style="margin-top: 20px" class=""></div>
    <div v-if="!show" class="flex items-center justify-center h-[60vh]">
      <div class="text-center">
        <img class="w-[120px] h-[140px] bg-no-repeat bg-center mx-auto" src="/upload.png" alt="">
        <p class="font-semibold text-xl mt-4">Tải lên tệp Excel để nhập</p>

      </div>
    </div>
    <div v-if="showDataTable && deviceStore.result" class="card">
      <div v-if="deviceStore.result.data.totalSucces != 0" class="">
        <h1 class="p-1 font-semibold">
          Tổng thiết bị nhập thành công:
          {{ deviceStore.result.data.totalSuccess }}
        </h1>
        <DataTable
          :value="deviceStore.result.data.successfulDevices"
          tableStyle="min-width: 40rem"
        >
    <template #empty>
          <div class="text-center">Không có</div>
        </template>
          <Column field="name" header="Tên"></Column>
          <Column field="serialNumber" header="Serial"></Column>
          <Column field="categoryName" header="Loại"></Column>
          <Column field="manufacturer" header="Nhà sản xuất"></Column>
          <Column field="purchaseDate" header="Ngày mua">
            <template #body="{ data }">
              {{ dayjs(data.purchaseDate).format("DD-MM-YYYY") }}
            </template></Column
          >
          <Column field="expirationDate" header="Ngày hết hạn">
            <template #body="{ data }">
              {{ dayjs(data.expirationDate).format("DD-MM-YYYY") }}
            </template></Column
          >
        </DataTable>
      </div>
      <div v-if="deviceStore.result.data.deviceErrors.length">
        <h1 class="p-1 font-semibold">Danh sách các thiết bị nhập lỗi</h1>
        <DataTable
          :value="deviceStore.result.data.deviceErrors"
          tableStyle="min-width: 40rem"
        >
    
          <Column field="name" header="Tên"></Column>
          <Column field="serialNumber" header="Serial"></Column>
          <Column field="categoryName" header="Loại"></Column>
          <Column field="manufacturer" header="Nhà sản xuất"></Column>
          <Column field="purchaseDate" header="Ngày mua">
            <template #body="{ data }">
              {{ dayjs(data.purchaseDate).format("DD-MM-YYYY") }}
            </template></Column
          >
          <Column field="expirationDate" header="Ngày hết hạn">
            <template #body="{ data }">
              {{ dayjs(data.expirationDate).format("DD-MM-YYYY") }}
            </template></Column
          >
        </DataTable>
      </div>
    </div>
  
  </div>
</template>
