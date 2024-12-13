<script setup>
import { ref, watchEffect, onMounted, onUnmounted } from "vue";
import Header from "@/components/common/Header.vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import { useUserStore } from "../stores/user.store";
import { useToast } from "vue-toast-notification";
import NotificationModal from "@/components/common/NotificationModal.vue";
import { useNotificationStore } from "@/stores/notification.store";
import { useMessageStore } from "@/stores/message.store";
import { useConversationStore } from "@/stores/conversation.store";
const authStore = useAuthStore();
const userStore = useUserStore();
const currentPage = ref("dashboard");
const $toast = useToast();
const notificationStore = useNotificationStore();
const conversationStore = useConversationStore();
const messageStore = useMessageStore();
const router = useRouter();
const name = {
  dashboard: "THỐNG KÊ",
  profile: "THÔNG TIN CÁ NHÂN",
  user: "TÀI KHOẢN",
  category: "DANH MỤC",
  location: "PHÒNG BAN",
};

const logout = () => {
  authStore.token = null;
  userStore.user = null;

  $toast.success("Đăng xuất thành công", { position: "top-right" });
  router.push({ name: "login" });
};
const showNotifications = ref(false);
const handleClickOutside = (event) => {
  const notificationContainer = document.querySelector(
    ".notification-container"
  );
  const notificationHeader = document.querySelector(".notification-header");
  if (
    notificationContainer &&
    !notificationContainer.contains(event.target) &&
    !notificationHeader.contains(event.target)
  ) {
    showNotifications.value = false;
  }
};
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
watchEffect(async () => {
  if (authStore.token) {
    await userStore.getMe();
    await notificationStore.getAllNotificationsByUserId();
    console.log(notificationStore.notifications);
  }
  if (userStore.user !== null) {
    console.log("f");
    messageStore.setupSocket();
    await conversationStore.fetchConversations();
  }
});
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
</style>
<template>
  <div class="flex md:p-0 lg:w-[80%] mx-auto background-manage">
    <div class="w-64 h-screen">
      <div class="p-4 flex items-center justify-between">
        <div class="p-4 flex items-center ">
        <img class="h-[50px]" src="/header.png" alt="" />
        <h2 class="text-4xl font-bold ml-4 text-green-700">EMS</h2>
      </div>
        <div class="relative text-2xl">
          <div
            @click="showNotifications = !showNotifications"
            class="cursor-pointer relative notification-header"
          >
            <div
              v-if="notificationStore.totalRead"
              class="absolute right-0 top-0 bg-red-500 rounded-full w-4 h-4 flex justify-center items-center"
            >
              <span class="text-[10px] text-white">
                {{ notificationStore.totalRead }}
              </span>
            </div>
            <div class="p-2 text-green-700 hover:opacity-50">
              <i class="fa-solid fa-bell"></i>
            </div>
          </div>
          <NotificationModal
            v-if="showNotifications"
            @showNotifications="
              (e) => {
                showNotifications = e;
              }
            "
          />
        </div>
      </div>
      <nav class="flex flex-col px-4">
        <ul>
          <li class="mb-2">
            <router-link
              active-class="active-link"
              :to="{ name: 'view-maintenance' }"
              class="block p-5 text-li hover:opacity-70"
            >
              <i class="fa-solid fa-screwdriver-wrench mr-2"></i>
              Yêu cầu bảo trì
            </router-link>
          </li>
          <li class="mb-2">
            <!-- <router-link
              active-class="active-link"
              :to="{ name: 'calendar' }"
              class="block p-5 text-li hover:opacity-70"
            >
              <i class="fa-solid fa-calendar-days mr-2"></i>
              Lịch bảo trì
            </router-link> -->
          </li>
          <li class="mb-2">
            <router-link
              v-if="userStore.user?.id"
              active-class="active-link"
              :to="{ name: 'home-profile', params: { id: userStore.user.id } }"
              class="block p-5 text-li hover:opacity-70"
            >
              <i class="fa-regular fa-address-card mr-2"></i>
              Thông tin cá nhân
            </router-link>
          </li>
          <li class="mb-2">
            <router-link
              active-class="active-link"
              :to="{ name: 'chat' }"
              class="block p-5 text-li hover:opacity-70"
            >
              <i class="fa-regular fa-message mr-2"></i>
              Trò chuyện
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

    <div class="border-1 p-4 rounded-lg shadow flex-1 bg-gray-100 -z-1">
      <router-view />
    </div>
  </div>
</template>
