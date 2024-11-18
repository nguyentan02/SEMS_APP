<script setup>
import { ref } from "vue";
import Footer from "@/components/common/Footer.vue";
import Menubar from "primevue/menubar";
import Avatar from "primevue/avatar";
import Button from "primevue/button";
import Badge from "primevue/badge";
const items = ref([
  {
    label: "Thống kê",
    icon: "fa-solid fa-chart-pie",
    to: "/test", // Đường dẫn router
  },
  {
    label: "Thiết bị",
    icon: "fa-solid fa-house-laptop",
    items: [
      {
        label: "Danh sách thiết bị",
        icon: "pi pi-bolt",
        to: "/device",
      },

      {
        label: "Quản lý sử dụng",
        icon: "pi pi-bol",
        to: "/usage",
      },
    ],
  },
  // {
  //   label: "Tin nhắn",
  //   icon: "pi pi-envelope",
  //   badge: 3,
  //   to: "/messages",
  // },
]);
</script>
<style scoped></style>
<template>
  <div class="flex flex-col md:p-0 lg:w-[80%] mx-auto min-h-screen">
    <header class="">
      <Menubar :model="items" class="">
        <template #start>
          <div>
            <img class="h-[50px]" src="/logoMain.jpg" alt="" />
          </div>
        </template>
        <template #item="{ item, props, hasSubmenu, root }">
          <template v-if="item.to">
            <router-link
              :to="item.to"
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
        <template #end>
          <div class="flex right-0 items-center justify-end gap-2">
            <div class="card flex flex-wrap justify-center gap-4"></div>
            <Avatar
              image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
              shape="circle"
            />
          </div>
        </template>
      </Menubar>
    </header>
    <!-- content -->
    <main class="flex-grow border border-gray-200 p-6 z-0">
      <router-view />
    </main>
    <footer class="border-t border-gray-200"><Footer /></footer>
  </div>
</template>
