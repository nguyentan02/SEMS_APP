<script setup>
import { ref } from "vue";
import Header from "@/components/common/Header.vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import { useUserStore } from "../stores/user.store";
import { useToast } from "vue-toast-notification";

const authStore = useAuthStore();
const userStore = useUserStore();

const $toast = useToast();
const router = useRouter();

const isExpanded = ref(true);
const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

const logout = () => {
  authStore.token = null;
  userStore.user = null;

  $toast.success("Đăng xuất thành công", { position: "top-right" });
  router.push({ name: "login" });
};
</script>
<style>
.active-link {
  /* background-color: #8ee286; */
  background: linear-gradient(
    to right,
    rgba(0, 200, 100, 0.1),
    rgba(0, 200, 100, 0)
  );
  color: #32c225;
  border-radius: 15px;
}

.bg-gray-200:hover {
  background-color: #d1d5db; /* Thay đổi màu khi hover */
}
.shadow-md:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Thêm đổ bóng khi hover */
}
</style>
<template>
  <Header />
  <div class="flex max-w-screen-2xl mx-auto background-manage">
    <div class="">
      <div
        class="relative h-screen bg-white flex flex-col shadow-md transition duration-300"
        :class="{ 'w-60': isExpanded, 'w-0': !isExpanded }"
      >
        <!-- Toggle Button -->
        <div
          class="absolute top-4 right-[-12px] bg-gray-200 p-1 rounded-sm cursor-pointer shadow-md z-10"
          @click="toggleSidebar"
        >
          <i class="fa-solid fa-bars"></i>
        </div>
        <!-- Sidebar Items -->
        <nav v-if="isExpanded" class="flex flex-col px-4">
          <ul>
            <li class="mb-2">
              <!-- <router-link
              :to="{ name: 'dashboard-manage' }"
              active-class="active-link"
              class="block p-2 hover:opacity-70 text-base"
            >
              <i class="fa-solid fa-chart-pie"></i>
              Thống kê
            </router-link> -->
            </li>
            <li class="mb-2 flex items-center">
              <i class="fa-regular fa-address-card mr-2"></i>
              <router-link
                active-class="active-link"
                :to="{
                  name: 'home-profile',
                  params: { id: userStore.user.id },
                }"
                class="block p-2 text-li hover:opacity-70"
              >
                Thông tin cá nhân
              </router-link>
            </li>
            <li class="mb-2 flex items-center">
              <i class="fa-solid fa-house-laptop mr-2"></i>
              <router-link
                active-class="active-link"
                :to="{ name: 'device' }"
                class="block p-2 text-li hover:opacity-70"
              >
                Thiết bị
              </router-link>
              <i class="fa-solid fa-caret-down"></i>
            </li>
            <li class="mb-2 flex items-center">
              <i class="fa-solid fa-users"></i>
              <router-link
                active-class="active-link"
                :to="{ name: 'transfer' }"
                class="block p-2 text-li hover:opacity-70"
              >
                Luân chuyển
              </router-link>
            </li>
            <li
              class="flex items-center absolute bottom-20 hover:bg-[#bbb8b8] p-2 rounded-xl cursor-pointer"
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
    </div>

    <div class="border-1 p-4 rounded-lg shadow flex-1">
      <router-view />
    </div>
  </div>
</template>
