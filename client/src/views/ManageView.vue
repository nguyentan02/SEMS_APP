<script setup>
import { ref } from "vue";
import Header from "@/components/common/Header.vue";
import { useAuthStore } from "../stores/auth.store";
import { useUserStore } from "../stores/user.store";
import { useToast } from "vue-toast-notification";
const authStore = useAuthStore();
const userStore = useUserStore();

const currentPage = ref("dashboard");

const name = {
  dashboard: "THỐNG KÊ",
  profile: "THÔNG TIN CÁ NHÂN",
  user: "TÀI KHOẢN",
  category: "DANH MỤC",
  location: "PHÒNG BAN",
};
// const showSide = ref(true);

// function toggleSideBar() {
//   showSide.value = !showSide.value;
// }
</script>
<style>
.active-link {
  background-color: #bbb8b8; /* Example - customize as needed */
  border-radius: 15px;
}
</style>
<template>
  <div class="flex max-w-screen-xl mx-auto">
    <div
      class="w-64 h-screen border-2 border-gray-600 bg-[rgb(var(--color-primary))]"
    >
      <div class="p-4 flex items-center justify-between">
        <h2 class="text-xl font-bold">EMS</h2>
      </div>
      <nav class="flex flex-col px-4">
        <ul>
          <li class="mb-2">
            <router-link
              :to="{ name: 'dashboard-manage' }"
              active-class="active-link"
              class="block p-5 hover:opacity-70 text-sm"
            >
              <i class="fa-solid fa-chart-pie"></i>
              Thống kê
            </router-link>
          </li>
          <li class="mb-2">
            <router-link
              active-class="active-link"
              :to="{ name: 'profile', params: { id: userStore.user.id } }"
              class="block p-5 text-sm hover:opacity-70"
            >
              <i class="fa-regular fa-address-card"></i>
              Thông tin cá nhân
            </router-link>
          </li>
          <li class="mb-2">
            <router-link
              active-class="active-link"
              :to="{ name: 'user-manage' }"
              class="block p-5 text-sm hover:opacity-70"
            >
              <i class="fa-solid fa-users"></i>
              Thành viên
            </router-link>
          </li>
          <li class="mb-2">
            <router-link
              active-class="active-link"
              :to="{ name: 'category-manage' }"
              class="block p-5 text-sm hover:opacity-70"
            >
              <i class="fa-solid fa-users"></i>
              Danh mục thiết bị
            </router-link>
          </li>
          <li class="mb-2">
            <router-link
              active-class="active-link"
              :to="{ name: 'location-manage' }"
              class="block p-5 text-sm hover:opacity-70"
            >
              <i class="fa-solid fa-house"></i>
              Phòng ban
            </router-link>
          </li>
        </ul>
      </nav>
    </div>

    <div class="border-1 p-4 rounded-lg shadow flex-1">
      <router-view
        @currentPage="
          (e) => {
            currentPage = e;
          }
        "
      />
    </div>
  </div>
</template>
