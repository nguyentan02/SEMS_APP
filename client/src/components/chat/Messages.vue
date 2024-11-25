<script setup>
import { onMounted, onUpdated, ref, watch, watchEffect } from "vue";
import Message from "./Message.vue";
import { useMessageStore } from "../../stores/message.store";
import Loading from "../common/Loading.vue";

const messageStore = useMessageStore();

const scroll_bottom = ref(null);

onUpdated(() => {
  scrollToBottom();
});

watch(
  messageStore.messages,
  () => {
    scrollToBottom();
  },
  {
    deep: true,
  }
);

onMounted(() => {
  scrollToBottom();
});

const scrollToBottom = () => {
  scroll_bottom.value.scrollTop = scroll_bottom.value.scrollHeight;
};
</script>

<template>
  <div
    ref="scroll_bottom"
    class="bg-slate-200 basis-full overflow-y-scroll no-scrollbar w-full"
    v-if="messageStore.messages"
  >
    <Message
      v-for="message in messageStore.messages"
      :key="message.id"
      :message="message"
    />
  </div>
  <div class="" v-else>
    <Loading />
  </div>
</template>
