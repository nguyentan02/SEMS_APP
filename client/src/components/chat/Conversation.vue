<script setup>
import Messages from "./Messages.vue";
import Input from "./Input.vue";
import { useConversationStore } from "../../stores/conversation.store";
import { useMessageStore } from "../../stores/message.store";
import { useUserStore } from "../../stores/user.store";
import { onUpdated, watchEffect } from "vue";
import { getSender } from "../../untils";

const conversationStore = useConversationStore();
const messageStore = useMessageStore();
const userStore = useUserStore();

const sendMessage = async (content) => {
  await messageStore.sendMessage({
    content: content,
    conversationId:
      conversationStore.conversations[conversationStore.activeIndex].id,
  });
  await conversationStore.fetchConversations();
  conversationStore.activeIndex = 0;
};

const sendImage = async (files) => {
  const data = new FormData();
  for (let i = 0; i < files.length; i++) {
    data.append("images", files[i]);
  }
  data.append(
    "conversationId",
    conversationStore.conversations[conversationStore.activeIndex].id
  );
  await messageStore.sendImage(data);
  await conversationStore.fetchConversations();
  conversationStore.activeIndex = 0;
};

onUpdated(async () => {
  if (conversationStore.activeIndex !== null) {
    await messageStore.readMessages(
      conversationStore.conversations[conversationStore.activeIndex]?.id
    );
  }
  if (
    conversationStore.conversations[conversationStore.activeIndex]?.Message &&
    conversationStore.conversations[conversationStore.activeIndex]?.Message[0]
      .read == false &&
    conversationStore.conversations[conversationStore.activeIndex]?.Message[0]
      .userId !== userStore.user.id
  ) {
    conversationStore.conversations[
      conversationStore.activeIndex
    ].Message[0].read = true;
    conversationStore.totalReadMessage = conversationStore.totalReadMessage - 1;
  }
});

watchEffect(async () => {
  if (conversationStore.activeIndex !== null) {
    await messageStore.getAllMessages(
      conversationStore.conversations[conversationStore.activeIndex]?.id
    );
  }
});
</script>

<template>
  <div
    class="w-[75%] flex-1 flex flex-col bg-slate-200 rounded-lg overflow-hidden border-2 border-blue-600"
  >
    <div
      v-if="conversationStore.activeIndex !== null"
      class="h-full flex flex-col justify-between"
    >
      <div
        class="bg-white py-2 px-4 flex justify-between items-center shadow-lg"
      >
        <div class="hover:underline text-black hover:text-blue-400">
          <h2 class="font-medium">
            {{
              getSender(
                userStore.user,
                conversationStore.conversations[conversationStore.activeIndex]
                  .User
              )?.name
            }}
          </h2>
        </div>
        <button @click="conversationStore.activeIndex = null">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <Messages class="flex-1" />
      <Input :sendImage="sendImage" :sendMessage="sendMessage" />
    </div>
    <div
      v-else
      class="w-full h-full flex justify-center items-center font-semibold text-2xl text-gray-400"
    >
      Mở một cuộc trò chuyện để bắt đầu.
    </div>
  </div>
</template>
