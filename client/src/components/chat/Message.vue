<script setup>
import { useUserStore } from "../../stores/user.store";
import dayjs from "dayjs";
import Image from "primevue/image";

const userStore = useUserStore();

const props = defineProps(["message"]);
</script>

<template>
  <div
    class="my-3 flex items-center p-3 w-full"
    :class="
      userStore.user.id === props.message.User.id
        ? 'flex-row-reverse'
        : 'flex-row'
    "
  >
    <div
      class="h-10 w-10 rounded-full overflow-hidden border-indigo-600 border"
    >
      <img
        class="h-full w-full"
        alt="logo"
        :src="props.message.User.user_avt"
      />
    </div>
    <div
      class="mx-4 text-white flex flex-col rounded-lg py-1 px-3 text max-w-[85%] break-all bg-[#1d4ed8]"
      :class="
        userStore.user.id === props.message.User.id
          ? 'message_right'
          : 'message_left'
      "
    >
      <p
        v-if="!props.message.isImage"
        class="w-full"
        :class="userStore.user.id === props.message.User.id ? '' : 'text-left'"
      >
        {{ props.message?.content }}
      </p>
      <p
        v-else
        class="w-full bg-white"
        :class="userStore.user.id === props.message.User.id ? '' : 'text-left'"
      >
        <!-- <img class="w-[200px] object-cover" :src="props.message?.content"> -->
        <Image
          :src="props.message?.content"
          :alt="props.message?.content"
          width="250"
          preview
          :pt="{ icon: 'p-image-action' }"
        />
      </p>
      <span class="text-xs">
        {{
          dayjs().diff(dayjs(props.message?.createdAt), "day") > 0
            ? dayjs(props.message?.createdAt).format("LT L")
            : dayjs(props.message?.createdAt).fromNow()
        }}
      </span>
    </div>
  </div>
</template>

<style>
.p-image-action {
  color: white;
}
</style>
