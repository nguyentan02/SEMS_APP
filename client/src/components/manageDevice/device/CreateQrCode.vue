<script setup>
import JsBarcode from "jsbarcode";
import { ref, watch, nextTick, watchEffect } from "vue";
import { FwbModal, FwbButton } from "flowbite-vue";
import { useDeviceStore } from "@/stores/device.store";
import Loading from "@/components/common/Loading.vue";

const deviceStore = useDeviceStore();
const qr = defineProps(["device"]);
// const dataObject = ref({
//   serialNumber: "",
// });
console.log(qr.device);
watchEffect(() => {});
watch(
  () => deviceStore.isShow.qrModal,
  async (isOpen) => {
    if (isOpen) {
      await nextTick(); // Chờ DOM cập nhật xong
      JsBarcode("#barcode")
        .options({ font: "OCR-B" })
        .CODE128(qr.device, {
          fontSize: 18,
          textMargin: 0,
        })
        .render();
    }
  }
);
</script>
<template>
  <fwb-modal
    v-if="deviceStore.isShow.qrModal"
    @close="deviceStore.closeQrCodeModal"
    size="sm"
  >
    <template #body>
      <div v-if="!deviceStore.isLoading" class="">
        <div class="flex flex-col items-center barcode-container text-center">
          <h2>Mã vạch thiết bị</h2>
          <svg id="barcode"></svg>
        </div>
      </div>
      <div v-else>
        <Loading />
      </div>
    </template>
    <!-- <template #footer>
      <div class="flex justify-end gap-2">
        <fwb-button @click="deviceStore.closeQrCodeModal" color="secondary">
          Đóng
        </fwb-button>
      </div>
    </template> -->
  </fwb-modal>
</template>
