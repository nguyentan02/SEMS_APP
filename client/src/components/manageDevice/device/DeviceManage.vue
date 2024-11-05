<script setup>
import { ref, onMounted, watchEffect } from "vue";
import { useDeviceStore } from "@/stores/device.store";
import Seach from "@/components/common/Seach.vue";
import Loading from "@/components/common/Loading.vue";
import { useManageDeviceStore } from "@/stores/manageDevice.store";
import AddDeviceModal from "./AddDeviceModal.vue";
import CreateQrCode from "./CreateQrCode.vue";
import {
  FwbButton,
  FwbModal,
  FwbInput,
  FwbSelect,
  FwbToast,
} from "flowbite-vue";
import { useToast } from "vue-toast-notification";
const manageDeviceStore = useManageDeviceStore();
const emit = defineEmits(["currentPage"]);
const currentDevice = ref(null);
const deviceStore = useDeviceStore();
function formatPrice(price, currency = "VND") {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}
onMounted(async () => {
  emit("currentPage", "devices");
  await deviceStore.getDevices({ name: "", page: 1 });
  console.log(deviceStore.devices);
  deviceStore.currentPage = 1;
  deviceStore.name = "";
});
</script>

<template>
  <h1 class="text-2xl font-bold mb-10 text-[#25861e]">Quản lý thiết bị</h1>
  <div class="flex items-center justify-between">
    <!-- <Seach
      :title="'Tìm kiếm danh mục'"
      @key="
        (e) => {
          categoryStore.name = e;
        }
      "
    /> -->
    <fwb-button
      color="green"
      size="sm"
      @click="
        () => {
          manageDeviceStore.showAddDeviceModal();
        }
      "
      >Thêm thiết bị <i class="fa-solid fa-plus"></i
    ></fwb-button>
  </div>
  <div
    v-if="!deviceStore.devices?.length"
    class="text-center text-red-500 text-xl"
  >
    <p colspan="7">Không có.</p>
  </div>
  <table v-else class="table-auto w-full mt-5 rounded-md mx-auto">
    <thead class="font-medium border-b-2 border-black">
      <tr class="text-left">
        <th class="text-center p-2 w-[10%]">STT</th>
        <th class="p-2">Thiết bị</th>
        <th class="p-2">Hình ảnh</th>
        <th class="p-2">Serial</th>
        <th class="p-2">Nhà sản xuất</th>
        <th class="p-2">Giá</th>
        <th class="p-2">Loại thiết bị</th>
        <th class="p-2"></th>
        <!-- <th class="p-2"></th> -->
        <th class="p-2 text-center">Tùy chọn</th>
      </tr>
    </thead>
    <tbody v-if="!deviceStore.isLoading">
      <tr
        v-for="(device, i) in deviceStore.devices"
        :key="device.id"
        class="border-b border-gray-400 transition duration-300 ease-in-out hover:bg-[#bbb8b8]"
      >
        <td class="font-medium text-center w-[10%]">
          {{ (deviceStore.currentPage - 1) * 10 + i + 1 }}
        </td>
        <td class="">
          {{ device.name }}
        </td>
        <td class="flex items-center whitespace-nowrap text-center m-3">
          <div
            class="w-[50px] h-[50px] overflow-hidden flex items-center justify-center rounded-md"
          >
            <img :src="device.image" alt="logo" />
          </div>
        </td>
        <td class="">
          {{ device.serialNumber }}
        </td>
        <td class="">
          {{ device.manufacturer }}
        </td>
        <td class="text-red-700 font-extrabold">
          {{ formatPrice(device.price) }}
        </td>
        <td class="">
          {{ device.category.categoryName }}
        </td>
        <td
          class="cursor-pointer"
          @click="
            () => {
              deviceStore.showQrCodeModal();
              currentDevice = device;
            }
          "
        >
          <i class="fa-solid fa-qrcode mr-2"></i>
        </td>
        <td class="">
          <div class="flex gap-2 items-center justify-center">
            <button class="">
              <i class="fa-regular fa-eye"></i>
            </button>
            <button
              class="p-2 text-red-500 hover:text-red-400 text-2xl"
              @click="
                async () => {
                  await deleteCategory(category.id);
                }
              "
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr class="text-center text-red-500 text-xl">
        <td colspan="7">
          <Loading />
        </td>
      </tr>
    </tbody>
  </table>
  <CreateQrCode :device="currentDevice" />
  <AddDeviceModal />
</template>
