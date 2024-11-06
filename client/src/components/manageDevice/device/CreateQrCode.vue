<script setup>
// import QrcodeVue from "qrcode.vue";
import JsBarcode from "jsbarcode";
import { nextTick, ref } from "vue";
import { FwbButton, FwbModal } from "flowbite-vue";
import { useDeviceStore } from "@/stores/device.store";
import Loading from "@/components/common/Loading.vue";
const deviceStore = useDeviceStore();
const qr = defineProps(["device"]);

const dataObject = ref({
  serialNumber: qr.device?.serialNumber,
});

nextTick(() => {
  JsBarcode("#barcode")
    .options({ font: "OCR-B" })
    .CODE128(dataObject.value.serialNumber, { fontSize: 18, textMargin: 0 })
    .blank(20)
    .render();
});
</script>
<template>
  <fwb-modal
    v-if="deviceStore.isShow.qrModal"
    @close="deviceStore.closeQrCodeModal"
    size="md"
  >
    <template #body>
      <div v-if="!deviceStore.isLoading" class="w-full">
        <div class="barcode-container">
          <h2>Mã vạch từ Dữ liệu</h2>
          <svg id="barcode"></svg>
        </div>
      </div>
      <div v-else>
        <Loading />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <!-- <fwb-button @click="generatePdf" color="green"> Test </fwb-button> -->
        <fwb-button @click="deviceStore.closeQrCodeModal" color="secondary">
          Đóng
        </fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
