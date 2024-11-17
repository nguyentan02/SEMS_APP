<script setup>
import { onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth.store";
import { useUserStore } from "../../stores/user.store";
import { useToast } from "vue-toast-notification";

import { FwbButton, FwbModal } from "flowbite-vue";
const authStore = useAuthStore();
const userStore = useUserStore();

const router = useRouter();
const route = useRoute();
const $toast = useToast();

const logout = () => {
  authStore.token = null;
  userStore.user = null;

  $toast.success("Đăng xuất thành công", { position: "top-right" });
  router.push({ name: "login" });
};

const emit = defineEmits(["toggleSidebar"]);
</script>
<template>
  <header class="h-[70px] sticky top-0 z-50 p-1 bg-white">
    <div class="flex items-center justify-between space-x-4 mt-3">
      <div class="flex ml-3">
        <button @click="emit('toggleSidebar')" class="mr-3">
          <i class="fa-solid fa-bars text-2xl"></i>
        </button>
        <div>
          <h2>EMS</h2>
        </div>
      </div>
      <div>
        <div class="group relative cursor-pointer">
          <div class="menu-hover flex items-center gap-1">
            <div
              class="h-10 w-10 overflow-hidden rounded-full flex items-center justify-center bg-white"
            >
              <img
                class="h-full w-full object-cover"
                :src="userStore.user?.user_avt"
                alt="logo user"
              />
            </div>
            <p
              class="text-md truncate font-semibold text-[#242020] min-w-[100px] md:min-w-[150px]"
            >
              {{ userStore.user?.name }}
            </p>
          </div>
          <div
            class="group-hover:visible invisible absolute bg-white w-full shadow-xl rounded-md"
          >
            <button
              @click="logout"
              class="block border-b p-2 text-sm hover:text-gray-400"
            >
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
