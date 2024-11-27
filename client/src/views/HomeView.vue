<script setup>
import { ref, watchEffect, onMounted, onUnmounted } from "vue";
import Footer from "@/components/common/Footer.vue";
import Header from "@/components/common/Header.vue";
import Menubar from "primevue/menubar";
import Avatar from "primevue/avatar";
import { useMessageStore } from "@/stores/message.store";
import Badge from "primevue/badge";
import Button from "primevue/button";
import { useConversationStore } from "@/stores/conversation.store";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import { useUserStore } from "../stores/user.store";
import { useToast } from "vue-toast-notification";
const $toast = useToast();
const authStore = useAuthStore();
const userStore = useUserStore();
const messageStore = useMessageStore();
const conversationStore = useConversationStore();
const router = useRouter();
const logout = () => {
  authStore.token = null;
  userStore.user = null;

  $toast.success("Đăng xuất thành công", { position: "top-right" });
  router.push({ name: "login" });
};
watchEffect(async () => {
  // if (authStore.token) {
  //     await userStore.getMe()
  //     await notificationStore.getAllNotificationsByUserId()
  // }
  console.log(userStore.user);
  if (userStore.user !== null) {
    console.log("f");
    messageStore.setupSocket();
    await conversationStore.fetchConversations();
  }
});
const items = ref([
  // {
  //   label: "Thống kê",
  //   icon: "fa-solid fa-chart-pie",
  //   to: "test",
  // },
  {
    label: "Thiết bị",
    icon: "fa-solid fa-house-laptop",
    items: [
      {
        label: "Danh sách thiết bị",
        icon: "fa-regular fa-hard-drive",
        to: "device",
      },

      {
        label: "Quản lý sử dụng",
        icon: "pi pi-bolt",
        to: "usage",
      },
    ],
  },

  {
    label: "Bảo trì",
    icon: "fa-solid fa-screwdriver-wrench",
    to: "maintenance",
  },
  {
    label: "Lịch sử",
    icon: "fa-solid fa-file-waveform",
    items: [
      {
        label: "Lịch sử sử dụng",

        to: "device",
      },

      {
        label: "Lịch sử bảo trì",

        to: "historymaintenance",
      },
      {
        label: "Lịch sử luân chuyển",

        to: "usage",
      },
    ],
  },
  {
    label: "Trò chuyện",
    icon: "fa-regular fa-message",
    to: "chat-home",
  },
]);
</script>
<style scoped></style>
<template>
  <Header />
  <div class="flex flex-col md:p-0 lg:w-[80%] mx-auto min-h-screen">
    <header class="flex justify-between items-center border bg-white">
      <Menubar :model="items" class="border-none bg-transparent z-10">
        <!-- <template #start>
          <div>
            <img class="h-[50px]" src="/logoMain.jpg" alt="" />
          </div>
        </template> -->
        <template #item="{ item, props, hasSubmenu, root }">
          <template v-if="item.to">
            <router-link
              :to="{ name: `${item.to}` }"
              v-ripple
              v-bind="props.action"
              class="flex item items-center m-2 p-2"
            >
              <span :class="item.icon" />
              <span class="ml-2 font-semibold">{{ item.label }}</span>
              <Badge
                v-if="item.badge"
                :class="{
                  'ml-auto bg-green-600 text-white': !root,
                  'ml-2 text-white': root,
                }"
                :value="item.badge"
              />

              <!-- <span
              v-if="item.shortcut"
              class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
              >{{ item.shortcut }}</span
            > -->
              <i
                v-if="hasSubmenu"
                :class="[
                  'pi pi-angle-down',
                  {
                    'pi-angle-down ml-2': root,
                    'pi-angle-right ml-auto': !root,
                  },
                ]"
              ></i>
            </router-link>
          </template>
          <template v-else>
            <div
              v-ripple
              class="flex item items-center m-2 p-2 cursor-pointer"
              v-bind="props.action"
            >
              <span :class="item.icon" />
              <span class="ml-2 font-semibold">{{ item.label }}</span>
              <Badge
                v-if="item.badge"
                :class="{
                  'ml-auto bg-green-600 text-white': !root,
                  'ml-2 text-white': root,
                }"
                :value="item.badge"
              />
              <i
                v-if="hasSubmenu"
                :class="[
                  {
                    'pi pi-angle-down ml-2': root,
                    'pi pi-angle-right ml-auto': !root,
                  },
                ]"
              ></i>
            </div>
          </template>
        </template>
      </Menubar>
      <!-- <div class="flex items-center justify-end gap-2 mr-5">
        <div class="card flex flex-wrap justify-center gap-4">
          {{ userStore.user?.name }}
        </div>
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
          shape="circle"
        />
      </div> -->
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
            class="text-md truncate font-semibold min-w-[100px] md:min-w-[150px]"
          >
            {{ userStore.user?.name }}
          </p>
        </div>
        <div
          class="group-hover:visible invisible absolute bg-white w-full shadow-xl rounded-md"
        >
          <router-link
            v-if="userStore.user?.id"
            :to="{ name: 'home1-profile', params: { id: userStore.user.id } }"
            class="block border-b p-4 text-sm hover:text-gray-400"
          >
            <i class="fa-regular fa-user"></i>
            Thông tin cá nhân
          </router-link>

          <button
            @click="logout"
            class="block border-b p-4 text-sm hover:text-gray-400"
          >
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
    <!-- content -->
    <main class="flex-grow border border-gray-200 bg p-6 mt-5">
      <router-view />
    </main>
    <footer class="border-t border-gray-200"><Footer /></footer>
  </div>
</template>
