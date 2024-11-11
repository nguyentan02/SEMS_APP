<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as XLSX from "xlsx";
import { useToast } from "vue-toast-notification";
import { FwbButton } from "flowbite-vue";
import { useDeviceStore } from "@/stores/device.store";

import Handsontable from "handsontable";
import "handsontable/dist/handsontable.full.min.css";
const router = useRouter();
const $toast = useToast();
const fileInput = ref(null);
const fileInfo = ref(null);
const fileData = ref([]);
const deviceStore = useDeviceStore();
const tableContainer = ref(null);
let hotInstance = null;

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};
const show = ref(false);
const file = ref(null);
const onFileSelected = (event) => {
  file.value = event.target.files[0];
  if (file.value) {
    show.value = true;
    readExcelFile(file.value);
  }
};

const readExcelFile = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    fileData.value = jsonData; // Bỏ hàng đầu tiên
    initializeHandsontable();
  };
  reader.readAsArrayBuffer(file);
};
const initializeHandsontable = () => {
  if (hotInstance) {
    hotInstance.updateSettings({
      data: fileData.value,
    });
  } else {
    hotInstance = new Handsontable(tableContainer.value, {
      data: fileData.value,
      rowHeaders: true,
      colHeaders: true,
      // fixedColumnsStart: 1,
      width: 700,
      height: 500,
      licenseKey: "non-commercial-and-evaluation",
    });
  }
};
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
  router.back();
};
const back = () => {
  router.back();
};

const downloadTemplate = () => {
  const url = "/path/to/your/template.xlsx";
  window.open(url, "_blank");
};
</script>

<template>
  <div class="">
    <div class="flex items-center h-[40px]">
      <fwb-button @click="triggerFileInput" size="sm">Tải lên tệp</fwb-button>
      <input
        ref="fileInput"
        hidden
        id="excel"
        class="text-lime-600"
        type="file"
        accept=".xls, .xlsx"
        @change="onFileSelected"
      />
      <div v-if="show">
        <button
          class="ml-2 bg-gray-200 px-4 rounded-lg hover:bg-gray-300"
          @click="back"
        >
          Huỷ
        </button>
        <button
          class="ml-2 bg-lime-700 px-4 rounded-lg hover:bg-gray-600"
          @click="createDevices"
        >
          Nhập
        </button>
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

    <div ref="tableContainer" class="mt-4"></div>

    <div v-if="!show" class="flex items-center justify-center h-[80vh]">
      <div class="text-center">
        <div
          class="w-[120px] h-[140px] bg-no-repeat bg-center mx-auto"
          style="
            background-image: url('https://emsystem.odoo.com/web/static/img/smiling_face.svg');
          "
        ></div>
        <p class="font-semibold text-xl mt-4">Tải lên tệp Excel để nhập</p>
        <div>Cần giúp đỡ?</div>
        <div
          class="mt-3 border-2 border-lime-600 p-2 hover:bg-lime-800 hover:text-white cursor-pointer"
          @click="downloadTemplate"
        >
          <span class="font-semibold">
            <i class="fa-solid fa-download mr-2"></i>Nhập mẫu thiết bị
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Thêm CSS nếu cần */
</style>
