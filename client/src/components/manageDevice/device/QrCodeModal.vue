<script setup>
import QRCode from "qrcode";
import { onMounted, ref, watch, nextTick } from "vue";
import { FwbButton, FwbModal } from "flowbite-vue";
import { useDeviceStore } from "@/stores/device.store";
import dayjs from "dayjs";
const deviceStore = useDeviceStore();
const qr = defineProps(["device"]);

watch(
  () => deviceStore.isShow.barCode,
  async (isOpen) => {
    if (isOpen) {
      console.log(qr.device);
      const dataObject = ref({
        "Số serial": qr.device?.serialNumber,
        "Tên": qr.device?.name,
        "Phòng": qr.device?.room.roomName
        || "Trống",
        "Khoa":qr.device?.room.deparment.deparmentName ||"Trống",
        "Trạng thái": qr.device?.statusDevice,
        "Ngày hết hạn":dayjs(qr.device?.expirationDate).format("DD/MM/YYYY"),
        "Giá":qr.device?.price
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
