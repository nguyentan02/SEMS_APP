<script setup>
import { useNotificationStore } from "../../stores/notification.store";

const notificationStore = useNotificationStore();

const emit = defineEmits(["showNotifications"]);

const gotoPost = async (index) => {
  await notificationStore.readNotification(
    notificationStore.notifications[index].id
  );
  if (notificationStore.err) {
    return;
  }
  notificationStore.notifications[index].read = true;
  notificationStore.totalRead = notificationStore.totalRead - 1;
};
</script>

<template>
  <div
    class="shadow-xl border overflow-hidden rounded-lg absolute w-[200px] lg:w-[300px] mt-1 flex flex-col notification-container z-10"
  >
    <div class="flex justify-between items-center bg-blue-600 p-2 px-3">
      <h1 class="text-white text-base lg:text-lg">Thông báo</h1>
      <button
        @click="emit('showNotifications', false)"
        class="hover:text-red-500 text-white"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="bg-white max-h-[200px] overflow-y-scroll no-scrollbar">
      <div
        v-if="notificationStore.notifications?.length"
        v-for="(notification, index) in notificationStore.notifications"
        :key="notification.id"
        :class="notification.read ? 'bg-white' : 'bg-[#60a5fa]'"
        @click="
          async () => {
            await gotoPost(index);
          }
        "
      >
        <div>
          <div
            class="border-b border-slate-200 text-sm p-2 grid grid-cols-6 cursor-pointer"
          >
            <span class="col-span-5">
              <span class="font-medium text-wrap">
                <!-- Có {{ notification?.Maintenance?.Device.name }} ở phòng
                <span class="font-semibold">
                  {{ notification?.Maintenance?.Device.room.roomName }}/{{
                    notification?.Maintenance?.Device.room?.deparment?.symbol
                  }}
                </span> -->
                {{ notification.message }}
              </span>
            </span>
          </div>
        </div>
      </div>
      <div v-else class="text-sm text-center p-2 text-red-500 italic">
        Không có thông báo.
      </div>
    </div>
  </div>
</template>
