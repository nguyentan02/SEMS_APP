<script setup>
import { onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth.store'
import { useUserStore } from '../../stores/user.store'
import { useToast } from 'vue-toast-notification'

import { FwbButton, FwbModal } from 'flowbite-vue'
const authStore = useAuthStore()
const userStore = useUserStore()

const router = useRouter()
const route = useRoute()
const $toast = useToast()

const logout =  ()=>{
     authStore.token = null
    userStore.user = null

    $toast.success("Đăng xuất thành công",{position:'top-right'})
    router.push({name:'home'})
}


// const isShowModal = ref(false)

// function closeModal () {
//   isShowModal.value = false
// }
// function showModal () {
//   isShowModal.value = true
// }
</script>
<template>
  <header class="h-full bg-white border-b-2 border-gray-200">
  <div class="flex justify-end items-center space-x-4 p-3">
    <div>
        <h2>Quản lý</h2>
    </div>
    <div class="relative">
      <button class="focus:outline-none">
        <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-4.215A2 2 0 0 0 17 11h-4m-2-4a2 2 0 1 1 4 0v1m-2 2a2 2 0 1 0 0 4h2m0 0H6m6 4v1a2 2 0 1 1-4 0v-1"></path>
        </svg>
      </button>
      <span class="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full"></span>
    </div>
    <div>
        <div class="group relative cursor-pointer">
                        <div class="menu-hover flex items-center gap-1">
                            <div
                                class="h-10 w-10 overflow-hidden rounded-full flex items-center justify-center bg-white">
                                <img class="h-full w-full object-cover" :src="userStore.user?.user_avt" alt="logo user">
                            </div>
                            <p class="text-md truncate font-semibold text-[#242020] min-w-[100px] md:min-w-[150px]">
                                {{ userStore.user?.name }}
                            </p>
                        </div>
                        <div class="group-hover:visible invisible absolute bg-white w-full shadow-xl rounded-md">
                            <button @click="logout" class="block border-b p-2 text-sm hover:text-gray-400">
                                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                Đăng xuất
                            </button>
                        </div>
                    </div>
    </div>
  </div>
</header>
    
</template>