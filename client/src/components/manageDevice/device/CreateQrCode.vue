<script setup>
import QrcodeVue from "qrcode.vue";
import { ref } from "vue";
import { FwbButton, FwbModal } from "flowbite-vue";
import { useDeviceStore } from "@/stores/device.store";
import Loading from "@/components/common/Loading.vue";
import dayjs from "dayjs";
// import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
const deviceStore = useDeviceStore();
const qr = defineProps(["device"]);
const dataObject = ref({
  name: qr.device?.name,
  serialNumber: qr.device?.serialNumber,
  manufacturer: qr.device?.manufacturer,
  price: qr.device?.price,
  purchaseDate: dayjs(qr.device?.purchaseDate).format("L"),
  expirationDate: dayjs(qr.device?.expirationDate).format("L"),
});

const qrCodeData = JSON.stringify(dataObject.value);
const generatePdf = async () => {
  const element = document.getElementById("qrCodeSection");

  if (element) {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fff", // Giúp loại bỏ mã màu `oklch` không hỗ trợ
    });
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const imgWidth = 200;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "JPEG", 20, 20, imgWidth, imgHeight);
    pdf.save(`QRCode_${qr.device?.serialNumber}.pdf`);
  } else {
    console.error("Không tìm thấy phần tử mã QR để tạo PDF.");
  }
};
</script>

<style>
.qr-code-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
</style>
<template>
  <fwb-modal
    v-if="deviceStore.isShow.qrModal"
    @close="deviceStore.closeQrCodeModal"
    size="md"
  >
    <template #body>
      <div v-if="!deviceStore.isLoading" class="w-full">
        <div id="qrCodeSection" class="qr-code-container">
          <!-- <h2>Mã QR từ {{ qr.device.serialNumber }}</h2> -->
          <qrcode-vue :value="qrCodeData" :size="200" />
        </div>
      </div>
      <div v-else>
        <Loading />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end gap-2">
        <fwb-button @click="generatePdf" color="green"> Test </fwb-button>
        <fwb-button @click="deviceStore.closeQrCodeModal" color="secondary">
          Đóng
        </fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
