<script setup>
import { ref } from "vue";
import Header from "@/components/common/Header.vue";
import { useAuthStore } from "../stores/auth.store";
import { useUserStore } from "../stores/user.store";
import { useToast } from "vue-toast-notification";
const authStore = useAuthStore();
const userStore = useUserStore();
const visible = ref(false);
</script>
<template>
  <div class="flex mx-auto">
    <div class="w-64 h-screen border-r-2 border-gray-200 bg-white">
      <div class="p-4 flex items-center justify-between">
        <h2 class="text-xl font-bold">EMS</h2>
      </div>
      <nav class="px-4">
        <ul>
          <li class="mb-2">
            <a
              href="#"
              class="flex items-center py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              <svg
                class="w-5 h-5 mr-3 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 12h6m3 0h9M9 9l3-3m0 12l-3-3"
                ></path>
              </svg>
              Home
            </a>
          </li>
          <li class="mb-2">
            <router-link
              :to="{ name: 'profile', params: { id: userStore.user.id } }"
              class="block border-b p-2 text-sm hover:text-gray-400"
            >
              <i class="fa-regular fa-address-card"></i>
              Thông tin cá nhân
            </router-link>
          </li>
          <li class="mb-2">
            <router-link
              :to="{ name: 'user-manager' }"
              class="block border-b p-2 text-sm hover:text-gray-400"
            >
              <i class="fa-solid fa-users"></i>
              Thành viên
            </router-link>
          </li>
          <li class="mb-2">
            <router-link
              :to="{ name: 'category-manage' }"
              class="block border-b p-2 text-sm hover:text-gray-400"
            >
              <i class="fa-solid fa-users"></i>
              Danh mục thiết bị
            </router-link>
          </li>
          <li class="mb-2">
            <router-link
              :to="{ name: 'location-manage' }"
              class="block border-b p-2 text-sm hover:text-gray-400"
            >
              <i class="fa-solid fa-house"></i>
              Phòng ban
            </router-link>
          </li>
        </ul>
      </nav>
      <!-- </div>
      <Header class=" w-full "/>
      
    </div> -->
    </div>
    <div class="border-1 p-4 rounded-lg shadow flex-1">
      <router-view />
    </div>
  </div>
</template>
