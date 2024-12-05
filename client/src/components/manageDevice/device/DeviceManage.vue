<script setup>
import { ref, onMounted, watchEffect, onBeforeUnmount, watch } from "vue";
import { useDeviceStore } from "@/stores/device.store";
import SeachDevice from "@/components/common/SeachDevice.vue";
import Loading from "@/components/common/Loading.vue";
import { useManageDeviceStore } from "@/stores/manageDevice.store";
import { useCategoryStore } from "@/stores/category.store";
import AddDeviceModal from "./AddDeviceModal.vue";
import CreateQrCode from "./CreateQrCode.vue";
import { useRouter } from "vue-router";
import { FwbButton, FwbPagination } from "flowbite-vue";
import { useToast } from "vue-toast-notification";
import QrCodeModal from "./QrCodeModal.vue";
import dayjs from "dayjs";
import { useDashboardtore } from "@/stores/dashboard.store";
const manageDeviceStore = useManageDeviceStore();
// const emit = defineEmits(["currentPage"]);
const currentDevice = ref(null);
const dashboardStore = useDashboardtore();
const deviceStore = useDeviceStore();
const categoryStore = useCategoryStore();
const router = useRouter();
function formatPrice(price, currency = "VND") {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}
const isFilterOpen = ref(false);
const $toast = useToast();
const test = ref([]);
const filterContainer = ref(null);
const toggleSort = ref("asc");
onMounted(async () => {
  // emit("currentPage", "devices");
  await categoryStore.getCategory({});
  await deviceStore.getDevices({ key: "", page: 1 });
  deviceStore.currentPage = 1;
  deviceStore.key = "";
  // test.value = deviceStore.devices
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("click", closeMenuOnClickOutside);
});

const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value;
};
const toggleSortOrder = () => {
  toggleSort.value = toggleSort.value === "asc" ? "desc" : "asc";
};
const handleClickOutside = (event) => {
  if (filterContainer.value && !filterContainer.value.contains(event.target)) {
    isFilterOpen.value = false;
  }
};

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("click", closeMenuOnClickOutside);
});
watchEffect(async () => {
  await deviceStore.getDevices({
    page: deviceStore.currentPage,
    key: deviceStore.key,
    categoryId: deviceStore.categoryId,
    sortByDate: toggleSort.value,
  });
});
const selectedCategoryName = ref("");
const exportExcel = async () => {
  await dashboardStore.downloadExcel();
};
const handleCategorySelect = () => {
  const selectedCategory = categoryStore.categorys.find(
    (category) => category.id === deviceStore.categoryId
  );
  selectedCategoryName.value = selectedCategory
    ? selectedCategory.categoryName
    : "";
};
const deleteDevice = async (id) => {
  const conFirm = confirm("Bạn có chắc chắn muốn xóa?");
  if (conFirm) {
    await deviceStore.deleteDevice(id);
    if (deviceStore.err) {
      $toast.error(deviceStore.err, { position: "top-right" });
      return;
    }
    $toast.success(deviceStore.result.message, { position: "top-right" });
    await deviceStore.getDevices({
      page: deviceStore.currentPage,
      key: deviceStore.key,
      categoryId: deviceStore.categoryId,
      sortByDate: toggleSort.value,
    });
  }
};
const clearSelectedCategory = () => {
  selectedCategoryName.value = "";
  deviceStore.categoryId = "";
};

const showMenu = ref(false);
const toggleMenu = (id) => {
  showMenu.value = { ...showMenu.value, [id]: !showMenu.value[id] };
};

const closeMenuOnClickOutside = (event) => {
  if (!event.target.closest(".menu-container")) {
    showMenu.value = {};
  }
};
</script>
<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
.background {
  color: #111827;
  background-color: #e6f2f3;
}
</style>
<template>
  <h1 class="text-2xl font-bold mb-2 text-[#25861e]">Danh sách thiết bị</h1> 
  <div class="mb-5">
    <span class="text-red-600 font-bold">Tổng thiết bị: {{ deviceStore.totalDevice }}</span>
  </div>

  <div class="flex items-center justify-between">
    <div class="flex relative">
      <fwb-button
        color="green"
        size="sm"
        class="font-semibold px-4 py-2 mr-2"
        @click="
          () => {
            manageDeviceStore.showAddDeviceModal();
          }
        "
        >Mới
        <i class="fa-solid fa-plus"></i>
      </fwb-button>
      <fwb-button
        class="mr-2"
        @click="
          () => {
            router.push({
              name: 'import',
            });
          }
        "
      >
        <i class="fa-solid fa-download mr-2"></i>Nhập file
      </fwb-button>
      <fwb-button @click="exportExcel" color="blue" outline>
        Xuất file
        <i class="fa-solid fa-file-export"></i>
      </fwb-button>
    </div>

    <div
      class="relative flex border border-gray-500 rounded-lg"
      ref="filterContainer"
    >
      <div class="">
        <SeachDevice
          :title="'Tìm kiếm...'"
          :categoryName="selectedCategoryName"
          @removeCategory="clearSelectedCategory"
          @key="
            (e) => {
              deviceStore.key = e;
            }
          "
        />
      </div>

      <button
        @click="toggleFilter"
        class="px-4 border-l border-l-gray-500"
        :class="{ background: isFilterOpen }"
      >
        <i
          class="fa-solid fa-caret-down transition-transform duration-300 ease-in-out"
          :class="{ 'rotate-180': isFilterOpen }"
        ></i>
      </button>

      <div
        v-if="isFilterOpen"
        class="absolute bg-white border right-0 mt-12 w-[300px] shadow-lg transition-opacity duration-300 ease-in-out rounded-md"
        :class="{ 'opacity-100': isFilterOpen, 'opacity-0': !isFilterOpen }"
      >
        <div class="grid grid-cols-1 divide-x divide-gray-200">
          <div class="p-4">
            <span class="font-semibold text-gray-800 mb-2"
              ><i class="fa-solid fa-filter text-fuchsia-800 mr-2"></i>Bộ
              lọc</span
            >
            <ul class="text-gray-600 space-y-2">
              <label for="isban">Danh mục: </label>
              <select
                name=""
                id="isban"
                class="rounded-lg p-1 w-auto"
                v-model="deviceStore.categoryId"
                @change="handleCategorySelect"
              >
                <option value="">Tất cả</option>
                <option
                  v-if="categoryStore.categorys?.length"
                  v-for="category in categoryStore.categorys"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.categoryName }}
                </option>
              </select>
            </ul>
          </div>

          <!-- <div class="p-4">
            <span class="font-semibold text-gray-800 mb-2">
              <i class="fa-solid fa-layer-group text-green-500 mr-2"></i>Nhóm
              theo</span
            >
            <ul class="text-gray-600 space-y-2">
              <label class="cursor-pointer hover:text-blue-600">
                <input
                  type="checkbox"
                  v-model="deviceStore.groupByCategory"
                  @change="handleGroupByCategoryChange"
                  class="mr-2"
                />
                Danh mục sản phẩm
              </label>
            </ul>
          </div> -->
        </div>
      </div>
    </div>
  </div>

  <div
    v-if="!manageDeviceStore.isShow.editDevice"
    class="background-manage mt-6"
  >
    <div v-if="!deviceStore.devices?.length" class="text-center text-xl">
      <div class="flex items-center justify-center h-[70vh]">
        <div class="text-center">
          <div
            class="w-[120px] h-[140px] bg-no-repeat bg-center mx-auto"
            style="
              background-image: url('https://emsystem.odoo.com/web/static/img/smiling_face.svg');
            "
          ></div>
          <p class="font-semibold text-xl mt-4">
            Không có thiết bị nào. Hãy thêm một thiết bị mới !
          </p>
        </div>
      </div>
    </div>
    <table v-else class="table-auto w-full mt-5 rounded-md mx-auto">
      <thead class="font-normal border-b-2 border-black">
        <tr class="text-center">
          <th class="text-center p-2 w-[5%]">STT</th>
          <th class="p-2">Thiết bị</th>
          <th class="p-2">Hình ảnh</th>
          <th class="p-2">Serial</th>
          <th class="p-2">Nhà sản xuất</th>
          <th class="p-2">Ngày mua</th>
          <th @click="toggleSortOrder" class="p-2">
            <div class="flex items-center justify-center">
              Ngày hết hạn
              <i
                :class="
                  toggleSort === 'asc'
                    ? 'fa-solid fa-arrow-up-wide-short'
                    : 'fa-solid fa-arrow-down-short-wide'
                "
              >
              </i>
            </div>
          </th>
          <th class=""></th>
          <th class="p-2">Giá</th>
          <th class="p-2 text-center">Loại thiết bị</th>
          <th class="p-2 text-center">Tùy chọn</th>
        </tr>
      </thead>
      <tbody v-if="!deviceStore.isLoading">
        <tr
          v-for="(device, i) in deviceStore.devices"
          :key="device.id"
          class="border-b border-gray-400 transition duration-300 ease-in-out hover:bg-[#d8d6d6]"
        >
          <td class="text-center w-[5%]">
            {{ (deviceStore.currentPage - 1) * 10 + i + 1 }}
          </td>
          <td class="text-center">
            {{ device.name }}
          </td>
          <td class="flex items-center whitespace-nowrap justify-center">
            <div
              class="w-[40px] h-[40px] overflow-hidden flex items-center justify-center rounded-md m-2"
            >
              <img :src="device.image" alt="logo" />
            </div>
          </td>
          <td class="text-center">
            {{ device.serialNumber }}
          </td>
          <td class="text-center">
            {{ device.manufacturer }}
          </td>
          <td class="text-center">
            {{ dayjs(device.purchaseDate).format("DD/MM/YYYY") }}
          </td>
          <td class="text-center">
            {{ dayjs(device.expirationDate).format("DD/MM/YYYY") }}
          </td>
          <td>
            <div
              v-if="device.expired == true"
              class=""
           ><span class="text-red-600">Hết hạn</span></div> 
          </td>
          <td class="text-gray-900 font-extrabold text-center">
            {{ formatPrice(device.price) }}
          </td>
          <td class="text-center">
            {{ device.category.categoryName }}
          </td>
          <td class="">
            <div class="flex gap-2 items-center justify-center">
              <button
                class="p-2 text-red-500 hover:text-red-400 text-xl"
                @click="
                  async () => {
                    await deleteDevice(device.id);
                  }
                "
              >
                <i class="fa-regular fa-trash-can"></i>
              </button>
              <button
                class="p-2 text-lime-500 hover:text-lime-200 text-xl"
                @click="
                  () => {
                    router.push({
                      name: 'detailDeivce',
                      params: { id: device.id },
                    });
                  }
                "
              >
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>

              <div class="relative menu-container">
                <!-- Nút mở menu -->
                <button
                  class="p-2 text-black hover:opacity-70 text-xl"
                  @click.stop="toggleMenu(device.id)"
                >
                  <i class="fa-solid fa-ellipsis-vertical"></i>
                </button>

                <!-- Menu thả xuống -->
                <div
                  v-if="showMenu[device.id]"
                  class="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10 p-2"
                >
                  <button
                    class="p-2 w-full hover:bg-gray-100 rounded border-b"
                    @click="
                      () => {
                        deviceStore.showBarCodeModal();
                        currentDevice = device;
                      }
                    "
                  >
                    <i class="fa-solid fa-qrcode text-xl"></i>
                  </button>

                  <button
                    class="p-2 w-full hover:bg-gray-100 rounded"
                    @click="
                      () => {
                        deviceStore.showQrCodeModal();
                        currentDevice = device.serialNumber;
                      }
                    "
                  >
                    <i class="fa-solid fa-barcode text-xl"></i>
                  </button>
                </div>
              </div>
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
    <div class="text-center py-2" v-if="deviceStore.totalPages >= 2">
      <FwbPagination
        v-model="deviceStore.currentPage"
        :total-pages="deviceStore.totalPages"
        :show-icons="true"
        :show-labels="false"
      />
    </div>
  </div>
  <CreateQrCode :device="currentDevice" />
  <QrCodeModal :device="currentDevice" />
  <AddDeviceModal />
</template>
