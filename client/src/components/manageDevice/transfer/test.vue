<template>
  <div class="barcode-container">
    <h2>Mã vạch từ Dữ liệu</h2>
    <svg id="barcode"></svg>
  </div>
</template>

<script setup>
import JsBarcode from "jsbarcode";
import { nextTick, ref, onMounted } from "vue";

const dataObject = ref({
  name: "Thiết bị A",
  serialNumber: "123456789",
  manufacturer: "Hãng XYZ",
  purchaseDate: "2024-10-01",
  expirationDate: "2025-10-01",
});
const jsonString = JSON.stringify(dataObject);
nextTick(() => {
  JsBarcode("#barcode")
    .options({ font: "OCR-B" }) // Will affect all barcodes
    .CODE128(dataObject.value.serialNumber, { fontSize: 18, textMargin: 0 })
    .blank(20) // Create space between the barcodes
    // .EAN5("12345", {
    //   height: 85,
    //   textPosition: "top",
    //   fontSize: 16,
    //   marginTop: 15,
    // })
    .render();
});
</script>
