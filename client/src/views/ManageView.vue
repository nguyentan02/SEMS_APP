<script setup>
import { ref, onMounted } from "vue";
import Header from "@/components/common/Header.vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import { useUserStore } from "../stores/user.store";
import { useToast } from "vue-toast-notification";
const authStore = useAuthStore();
const userStore = useUserStore();

const currentPage = ref("dashboard");
const $toast = useToast();
const router = useRouter();
// const name = {
//   dashboard: "THỐNG KÊ",
//   profile: "THÔNG TIN CÁ NHÂN",
//   user: "TÀI KHOẢN",
//   category: "DANH MỤC",
//   location: "PHÒNG BAN",
// };
// const showSide = ref(true);

// function toggleSideBar() {
//   showSide.value = !showSide.value;
// }''
onMounted(() => {
  document.body.classList.add("dark-mode");
  document.body.style.background = "#000";
});
const logout = () => {
  authStore.token = null;
  userStore.user = null;
  $toast.success("Đăng xuất thành công", { position: "top-right" });
  router.push({ name: "login" });
};
</script>
<style>
.active-link {
  background: linear-gradient(
    to right,
    rgba(242, 243, 241, 0.1),
    rgba(0, 200, 100, 0)
  );
  color: #e5e7eb;
  border-radius: 15px;
}
.dark-mode {
  color: #fff;
}
</style>
<template>
  <div class="flex max-w-screen-xl mx-auto">
    <div
      class="w-64 h-screen border-2 border-gray-600 bg-[rgb(var(--color-primary))]"
    >
      <div class="p-4 flex items-center justify-between">
        <img class="h-[50px]" src="/logoMain.jpg" alt="" />
        <!-- <h2 class="text-xl font-bold">EMS</h2> -->
      </div>
      <nav class="flex flex-col px-4">
        <ul>
          <li class="mb-2">
            <router-link
              :to="{ name: 'dashboard-manage' }"
              active-class="active-link"
              class="block p-5 hover:opacity-70 text-base"
            >
              <i class="fa-solid fa-chart-pie"></i>
              Thống kê
            </router-link>
          </li>
          <li class="mb-2">
            <router-link
              v-if="userStore.user?.id"
              active-class="active-link"
              :to="{
                name: 'manage-profile',
                params: { id: userStore.user.id },
              }"
              class="block p-5 text-base hover:opacity-70"
            >
              <i class="fa-regular fa-address-card"></i>
              Thông tin cá nhân
            </router-link>
          </li>
          <li class="mb-2">
            <router-link
              active-class="active-link"
              :to="{ name: 'user-manage' }"
              class="block p-5 text-base hover:opacity-70"
            >
              <i class="fa-solid fa-users"></i>
              Thành viên
            </router-link>
          </li>
          <li class="mb-2">
            <router-link
              active-class="active-link"
              :to="{ name: 'category-manage' }"
              class="block p-5 text-base hover:opacity-70"
            >
              <i class="fa-solid fa-users"></i>
              Danh mục thiết bị
            </router-link>
          </li>
          <li class="mb-2">
            <router-link
              active-class="active-link"
              :to="{ name: 'location-manage' }"
              class="block p-5 text-base hover:opacity-70"
            >
              <i class="fa-solid fa-house"></i>
              Phòng ban
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
              <span class="text-[10px] truncate min-w-[100px] md:min-w-[150px]">
                {{ userStore.user?.email }}
              </span>
            </div>
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
          </li>
        </ul>
      </nav>
    </div>

    <div
      class="border-1 p-4 rounded-lg shadow flex-1 bg-[rgb(var(--color-primary))]"
    >
      <router-view />
    </div>
  </div>
</template>
