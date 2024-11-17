<script setup>
import { ref } from "vue";
import Header from "@/components/common/Header.vue";
import { useUserStore } from "../stores/user.store";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import Footer from "@/components/common/Footer.vue";
import { useToast } from "vue-toast-notification";
const userStore = useUserStore();
const authStore = useAuthStore();

const $toast = useToast();
const router = useRouter();

// Menu items
const menuItems = [
  {
    label: "Thông tin cá nhân",
    icon: "fa-regular fa-address-card",
    to: { name: "home-profile", params: { id: userStore.user.id } },
  },
  {
    label: "Thiết bị",
    icon: "fa-solid fa-house-laptop",
    to: { name: "device" },
  },
  {
    label: "Luân chuyển",
    icon: "fa-solid fa-users",
    to: { name: "transfer" },
  },
];

const isExpanded = ref(true);
const isDeviceDropdownOpen = ref(false);
// Toggle sidebar function
const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};
const toggleDeviceDropdown = () => {
  isDeviceDropdownOpen.value = !isDeviceDropdownOpen.value;
};
const logout = () => {
  authStore.token = null;
  userStore.user = null;

  $toast.success("Đăng xuất thành công", { position: "top-right" });
  router.push({ name: "login" });
};
</script>

<style scoped>
.active-link {
  background: linear-gradient(
    to right,
    rgba(0, 200, 100, 0.1),
    rgba(0, 200, 100, 0)
  );
  color: #32c225;
  border-radius: 10px;
}

.sidebar {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.dropdown-item {
  padding-left: 25px; /* Lùi vào để thể hiện menu con */
}
</style>

<template>
  <div class="flex flex-col md:p-0 lg:w-[80%] mx-auto h-screen">
    <!-- Header -->
    <Header @toggleSidebar="toggleSidebar" />

    <!-- Sidebar & Main Content -->
    <div class="flex flex-1 border border-gray-200">
      <!-- Sidebar -->
      <div :class="{ 'w-60': isExpanded, 'w-0': !isExpanded }" class="sidebar">
        <nav v-if="isExpanded" class="flex flex-col px-4">
          <ul>
            <li class="mb-2">
              <router-link
                :to="{ name: 'test' }"
                active-class="active-link"
                class="block p-2 text-li hover:opacity-70 whitespace-nowrap"
              >
                <i class="fa-solid fa-chart-pie mr-2"></i>
                Thống kê
              </router-link>
            </li>
            <li class="mb-2">
              <router-link
                active-class="active-link"
                :to="{
                  name: 'home-profile',
                  params: { id: userStore.user.id },
                }"
                class="block p-2 text-li hover:opacity-70 whitespace-nowrap"
              >
                <i class="fa-regular fa-address-card mr-2"></i>
                Thông tin cá nhân
              </router-link>
            </li>
            <li>
              <div
                class="p-2 text-li hover:opacity-70 flex items-center justify-between whitespace-nowrap cursor-pointer"
                @click="toggleDeviceDropdown"
              >
                <div class="flex items-center">
                  <i class="fa-solid fa-house-laptop mr-2"></i>
                  Thiết bị
                </div>
                <i
                  :class="
                    isDeviceDropdownOpen
                      ? 'fa-solid fa-chevron-up'
                      : 'fa-solid fa-chevron-down'
                  "
                ></i>
              </div>
              <!-- Dropdown menu -->
              <ul v-if="isDeviceDropdownOpen" class="pl-4">
                <li class="mb-2 dropdown-item">
                  <router-link
                    :to="{ name: 'device' }"
                    active-class="active-link"
                    class="block p-2 text-li hover:opacity-70 whitespace-nowrap"
                  >
                    Danh sách thiết bị
                  </router-link>
                </li>
                <li class="mb-2 dropdown-item">
                  <router-link
                    :to="{ name: 'usageDevice' }"
                    active-class="active-link"
                    class="block p-2 text-li hover:opacity-70 whitespace-nowrap"
                  >
                    Quản lý sử dụng
                  </router-link>
                </li>
              </ul>
            </li>
            <li class="mb-2">
              <router-link
                active-class="active-link"
                :to="{ name: 'transfer' }"
                class="block p-2 text-li hover:opacity-70 whitespace-nowrap"
              >
                <i class="fa-solid fa-users"></i>
                Luân chuyển
              </router-link>
            </li>
            <li
              class="flex items-center absolute bottom-20 hover:bg-[#bbb8b8] p-1 rounded-xl cursor-pointer"
              @click="logout"
            >
              <div
                class="h-10 w-10 overflow-hidden rounded-full flex items-center justify-center bg-white"
              >
                <img
                  class="h-full w-full object-cover"
                  :src="userStore.user?.user_avt"
                  alt="logo user"
                />
              </div>
              <div class="flex flex-col ml-1">
                <span
                  class="truncate font-semibold min-w-[100px] md:min-w-[150px]"
                >
                  {{ userStore.user?.name }}
                </span>
                <span
                  class="text-[10px] truncate min-w-[100px] md:min-w-[150px]"
                >
                  {{ userStore.user?.email }}
                </span>
              </div>
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Main Content -->
      <div class="flex-1 p-5">
        <router-view />
      </div>
    </div>
  </div>
</template>
