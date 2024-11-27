<script setup>
import QRCode from "qrcode";
import { onMounted, ref, watch, nextTick } from "vue";
import { FwbButton, FwbModal } from "flowbite-vue";
import { useDeviceStore } from "@/stores/device.store";

const deviceStore = useDeviceStore();
const qr = defineProps(["device"]);

watch(
  () => deviceStore.isShow.barCode,
  async (isOpen) => {
    if (isOpen) {
      console.log(qr.device);
      const dataObject = ref({
        serialNumber: qr.device?.serialNumber,
        name: qr.device?.name,
        location: qr.device?.location || "Trống",
        status: qr.device?.statusDevice,
      });
      await nextTick();
      const jsonData = JSON.stringify(dataObject.value);
      QRCode.toCanvas(document.getElementById("qrcode"), jsonData, {
        width: 150,
      });
    }
  }
);
</script>

<template>
  <fwb-modal
    v-if="deviceStore.isShow.barCode"
    @close="deviceStore.closeBarCodeModal"
    size="sm"
  >
    <template #body>
      <div class="w-full flex flex-col items-center">
        <h2>Mã QR</h2>
        <canvas id="qrcode"></canvas>
      </div>
    </template>
    <!-- <template #footer>
      <div class="flex justify-end gap-2">
        <fwb-button @click="deviceStore.closeBarCodeModal" color="secondary">
          Đóng
        </fwb-button>
      </div>
    </template> -->
  </fwb-modal>
</template>
