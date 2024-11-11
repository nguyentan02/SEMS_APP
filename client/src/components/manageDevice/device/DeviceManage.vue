div
<script setup>
import { ref, onMounted, watchEffect, onBeforeUnmount } from "vue";
import { useDeviceStore } from "@/stores/device.store";
import SeachDevice from "@/components/common/SeachDevice.vue";
import Loading from "@/components/common/Loading.vue";
import { useManageDeviceStore } from "@/stores/manageDevice.store";
import AddDeviceModal from "./AddDeviceModal.vue";
import { useRouter } from "vue-router";
import {
  FwbButton,
  FwbModal,
  FwbInput,
  FwbSelect,
  FwbToast,
  FwbPagination,
} from "flowbite-vue";
const manageDeviceStore = useManageDeviceStore();
const emit = defineEmits(["currentPage"]);
const currentDevice = ref(null);
const deviceStore = useDeviceStore();
const router = useRouter();
function formatPrice(price, currency = "VND") {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}
watchEffect(async () => {
  await deviceStore.getDevices({
    page: deviceStore.currentPage,
    name: deviceStore.name,
  });
});
onMounted(async () => {
  emit("currentPage", "devices");
  await deviceStore.getDevices({ name: "", page: 1 });
  deviceStore.currentPage = 1;
  deviceStore.name = "";
  document.addEventListener("click", handleClickOutside);
});

const isFilterOpen = ref(false);
const filterContainer = ref(null);
const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value;
};
const showSide = ref(false);
const toggleAddDevice = () => {
  showSide.value = !showSide.value;
};
const handleClickOutside = (event) => {
  if (filterContainer.value && !filterContainer.value.contains(event.target)) {
    isFilterOpen.value = false;
  }
};

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
.background {
  color: #111827;
  background-color: #e6f2f3;
  border: 1px solid #017e84;
  border-color: #017e84;
}
</style>
<template>
  <h1 class="text-2xl font-bold mb-10 text-[#25861e]">Quản lý thiết bị</h1>
  <div class="flex items-center justify-between">
    <div class="relative w-[20%]">
      <fwb-button
        color="green"
        size="sm"
        class="font-semibold px-4 py-2"
        @click="
          () => {
            manageDeviceStore.showAddDeviceModal();
          }
        "
        >Mới
        <i class="fa-solid fa-plus"></i>
      </fwb-button>

      <button @click="toggleAddDevice" class="ml-2">
        <i class="fa-solid fa-gear"></i>
      </button>
      <div
        v-show="showSide"
        class="absolute mt-1 -right-8 bg-white flex flex-col gap-2 border border-gray-300 rounded-md"
      >
        <span
          class="cursor-pointer px-4 py-2 hover:bg-gray-200"
          @click="
            () => {
              router.push({
                name: 'import',
              });
            }
          "
        >
          <i class="fa-solid fa-download mr-2"></i>Nhập bản ghi
        </span>
        <span class="px-4 py-2"
          ><i class="fa-solid fa-upload mr-2"></i> Xuất toàn bộ
        </span>
      </div>
    </div>

    <div class="relative flex rounded-lg" ref="filterContainer">
      <div>
        <SeachDevice
          :title="'Tìm kiếm...'"
          @key="
            (e) => {
              deviceStore.name = e;
            }
          "
        />
      </div>
      <button
        @click="toggleFilter"
        class="px-4 border-l border-l-gray-500 bg-white"
        :class="{ background: isFilterOpen }"
      >
        <i
          class="fa-solid fa-caret-down transition-transform duration-300 ease-in-out"
          :class="{ 'rotate-180': isFilterOpen }"
        ></i>
      </button>

      <div
        v-if="isFilterOpen"
        class="absolute bg-white border right-0 mt-12 w-[630px] shadow-lg transition-opacity duration-300 ease-in-out rounded-md"
        :class="{ 'opacity-100': isFilterOpen, 'opacity-0': !isFilterOpen }"
      >
        <div class="grid grid-cols-2 divide-x divide-gray-200">
          <div class="p-4">
            <span class="font-semibold text-gray-800 mb-2"
              ><i class="fa-solid fa-filter text-fuchsia-800 mr-2"></i>Bộ
              lọc</span
            >
            <ul class="text-gray-600 space-y-2">
              <li class="cursor-pointer hover:text-blue-600">Dịch vụ</li>
              <li class="cursor-pointer hover:text-blue-600">Hàng hóa</li>
              <li class="cursor-pointer hover:text-blue-600">
                Quản lý tồn kho
              </li>
              <li class="cursor-pointer hover:text-blue-600">Bán hàng</li>
              <li class="cursor-pointer hover:text-blue-600">Mua hàng</li>
              <li class="cursor-pointer hover:text-blue-600">
                Sản phẩm còn hàng
              </li>
              <li class="cursor-pointer hover:text-blue-600">
                Số lượng dự báo âm
              </li>
              <li class="cursor-pointer hover:text-blue-600">Yêu thích</li>
              <li class="cursor-pointer hover:text-blue-600">Cảnh báo</li>
              <li class="cursor-pointer hover:text-blue-600">Đã lưu trữ</li>
            </ul>
          </div>

          <div class="p-4">
            <span class="font-semibold text-gray-800 mb-2">
              <i class="fa-solid fa-layer-group text-green-500 mr-2"></i>Nhóm
              theo</span
            >
            <ul class="text-gray-600 space-y-2">
              <li class="cursor-pointer hover:text-blue-600">Nhà sản xuất</li>
              <li class="cursor-pointer hover:text-blue-600">
                Danh mục sản phẩm
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center mt-2" v-if="deviceStore.totalPages >= 2">
      <FwbPagination
        v-model="deviceStore.currentPage"
        :total-pages="deviceStore.totalPages"
        :show-icons="true"
        :show-labels="false"
      />
    </div>
  </div>

  <div v-if="!manageDeviceStore.isShow.editDevice">
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

          <th class="p-2 text-center">Tùy chọn</th>
        </tr>
      </thead>
      <tbody v-if="!deviceStore.isLoading">
        <tr
          v-for="(device, i) in deviceStore.devices"
          :key="device.id"
          class="border-b border-gray-400 transition duration-300 ease-in-out hover:bg-[#d8d6d6]"
          @click="
            () => {
              // currentDevice = device;
              router.push({
                name: 'detailDeivce',
                params: { id: device.id },
              });
            }
          "
        >
          <td class="font-medium text-center w-[10%]">
            {{ (deviceStore.currentPage - 1) * 10 + i + 1 }}
          </td>
          <td class="">
            {{ device.name }}
          </td>
          <td class="flex items-center whitespace-nowrap text-center">
            <div
              class="w-[40px] h-[40px] overflow-hidden flex items-center justify-center rounded-md m-2"
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

          <td class="">
            <div class="flex gap-2 items-center justify-center">
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
          <td class="absolute right-[45%]">
            <Loading />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <!-- <EditDevice /> -->
  <AddDeviceModal />
</template>
