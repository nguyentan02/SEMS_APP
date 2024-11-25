<script setup>
import { ref, watchEffect } from "vue";
import { useConversationStore } from "../../stores/conversation.store";

const props = defineProps(["sendMessage", "sendImage"]);

const conversationStore = useConversationStore();

const newMessage = ref("");
const selectedFile = ref(null);

const handleSendMessage = () => {
  if (newMessage.value == "") return;
  props.sendMessage(newMessage.value);
  newMessage.value = "";
};

const onFileSelected = (event) => {
  selectedFile.value = event.target.files;
  if (selectedFile.value == null) return;
  props.sendImage(selectedFile.value);
  selectedFile.value = null;
};

watchEffect(() => {
  if (conversationStore.activeIndex) {
    newMessage.value = "";
    selectedFile.value = null;
  }
});
</script>

<template>
  <div class="flex justify-between items-center bg-white">
    <input
      type="text"
      placeholder="Nhập tin nhắn ..."
      v-model="newMessage"
      @keyup.enter="handleSendMessage"
      class="p-2 w-full border-none outline-none border-transparent focus:border-transparent focus:ring-0 text-black"
    />
    <div class="flex gap-3 mx-2">
      <span>
        <label for="images" class="cursor-pointer">
          <i class="fa-regular fa-image text-black"></i>
          <input
            @change="onFileSelected"
            type="file"
            name="images"
            id="images"
            accept="image/png, image/jpeg"
            hidden
            multiple
          />
        </label>
      </span>
      <span @click="handleSendMessage">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-6 h-6 cursor-pointer text-black"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      </span>
    </div>
  </div>
</template>
