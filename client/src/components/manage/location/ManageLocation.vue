<script setup>
import { onMounted, ref, watchEffect } from "vue";
import { useLocationStore } from "@/stores/location.store";
import Loading from "@/components/common/Loading.vue";
import { useManageStore } from "@/stores/manage.store";
import AddLocationModal from "./AddLocationModal.vue";
import EditLocationModal from "./EditLocationModal.vue";
import { useToast } from "vue-toast-notification";
import { FwbPagination } from "flowbite-vue";
import DetailModal from "./DetailModal.vue";
import Seach from "@/components/common/Seach.vue";
import { FwbButton } from "flowbite-vue";
const emit = defineEmits(["currentPage"]);
const locationStore = useLocationStore();
const manageStore = useManageStore();
const $toast = useToast();
const currentLocation = ref(null);
watchEffect(async () => {
  await locationStore.getLocations({
    key: locationStore.key,
    page: locationStore.currentPage,
  });
});
onMounted(async () => {
  emit("currentPage", "locations");
  await locationStore.getLocations({ key: "", page: 1 });
  locationStore.currentPage = 1;
  locationStore.key = "";
});

const deleteLocation = async (id) => {
  const conFirm = confirm("Bạn có chắc chắn muốn xóa?");
  if (conFirm) {
    await locationStore.deleteDepartment(id);
    if (locationStore.err) {
      $toast.error(locationStore.err, { position: "top-right" });
      return;
    }
    $toast.success(locationStore.result.message, { position: "top-right" });
    await locationStore.getLocations({
      key: locationStore.key,
      page: locationStore.currentPage,
    });
  }
};
</script>
<template>
  <h1 class="text-2xl font-bold mb-10">Quản lý phòng ban</h1>
  <div class="flex items-center justify-between">
    <Seach
      class="border border-gray-400"
      :title="'Tìm kiếm địa điểm'"
      @key="
        (e) => {
          locationStore.key = e;
        }
      "
    />
    <fwb-button
      color="default"
      class="ml-2 py-2"
      size="sm"
      @click="
        () => {
          manageStore.showAddLocationModal();
        }
      "
      >Thêm <i class="fa-solid fa-plus"></i
    ></fwb-button>
  </div>

  <table
    class="table-auto border-b border-black bg-[rgb(var(--color-primary))] w-full mt-5 rounded-md mx-auto"
  >
    <thead class="font-medium">
      <tr class="text-left border-b border-black">
        <th class="text-center pb-2 w-[10%]">STT</th>
        <th class="p-2">Khoa</th>
        <th class="p-2 text-center">Kí hiệu</th>
        <th class="p-2 text-center">Số lượng phòng</th>
        <th class="text-center p-2">Tùy chọn</th>
      </tr>
    </thead>
    <tbody v-if="!locationStore.isLoading">
      <tr
        v-if="locationStore.locations?.length"
        v-for="(location, i) in locationStore.locations"
        :key="location.id"
        class="border-b transition duration-300 ease-in-out hover:bg-[#bbb8b8]"
      >
        <td class="font-medium text-center w-[10%]">
          {{ (locationStore.currentPage - 1) * 10 + i + 1 }}
        </td>
        <td class="">
          {{ location.deparmentName }}
        </td>
        <td class="text-center">
          {{ location.symbol }}
        </td>
        <td class="text-center cursor-pointer">
          {{ location.roomCount }}
          <button
            @click="
              () => {
                manageStore.showDetailModal();
                currentLocation = location;
              }
            "
          >
            <i class="fa-regular fa-eye hover:text-zinc-500"></i>
          </button>
        </td>
        <!-- <td class="flex" v-for="(room, i) in location.rooms" :key="room.id">
          {{ room.roomName }}
        </td> -->
        <td class="w-[20%]">
          <div class="flex gap-2 items-center justify-center">
            <button
              class="p-2 text-yellow-300 hover:text-yellow-200 text-2xl"
              @click="
                () => {
                  manageStore.showEditLocationModal();
                  currentLocation = location;
                }
              "
            >
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button
              class="p-2 text-red-500 hover:text-red-400 text-2xl"
              @click="
                async () => {
                  await deleteLocation(location.id);
                }
              "
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
      <tr v-else class="text-center text-red-500 text-xl">
        <td colspan="4">Không có.</td>
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
  <div class="w-full text-center mt-2" v-if="locationStore.totalPages >= 2">
    <FwbPagination
      v-model="locationStore.currentPage"
      :total-pages="locationStore.totalPages"
      :show-icons="true"
      :show-labels="false"
    />
  </div>
  <table></table>
  <AddLocationModal />
  <EditLocationModal :location="currentLocation" />
  <DetailModal :location="currentLocation" />
</template>
