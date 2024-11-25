<script setup>
import { useConversationStore } from "../../stores/conversation.store";
import { useUserStore } from "../../stores/user.store";
import Conversations from "../chat/Conversations.vue";
import { ref, onMounted, onUnmounted } from "vue";
import Loading from "../common/Loading.vue";
import { useToast } from "vue-toast-notification";
import SeachChat from "../common/SeachChat.vue";
const conversationStore = useConversationStore();
const userStore = useUserStore();
const showUsers = ref(false);
const $toast = useToast();
const getOther = (loggedUser, users) => {
  return users[0]?.id == loggedUser?.id ? 1 : 0;
};

const handleSearch = (key) => {
  conversationStore.activeIndex = null;
  if (key == "") {
    conversationStore.searchResult = conversationStore.conversations;
  } else {
    conversationStore.searchResult = conversationStore.conversations.filter(
      (conversation) => {
        const indexUser = getOther(userStore.user, conversation.User);
        return conversation.User[indexUser].name
          .toLowerCase()
          .includes(key.toLowerCase());
      }
    );
  }
};

const getUserNotMe = async () => {
  await userStore.getUserNotMe();

  showUsers.value = !showUsers.value;
};

const userListRef = ref(null);

const handleClickOutside = (event) => {
  if (userListRef.value && !userListRef.value.contains(event.target)) {
    showUsers.value = false;
  }
};
const goMessage = async (id) => {
  await conversationStore.accessConversation({ userId: id });
  if (conversationStore.err) {
    $toast.error(conversationStore.err, { position: "top-right" });
    return;
  }
  // $toast.success(conversationStore.result.message, { position: "top-right" });
  showUsers.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="w-[25%] flex flex-col overflow-hidden">
    <div class="flex items-center justify-between">
      <SeachChat
        class="border-sky-300 border bg-white"
        :title="`Tìm kiếm cuộc trò chuyện`"
        @key="(e) => handleSearch(e)"
      />
      <div>
        <button
          class="bg-blue-700 text-white px-3 py-1 rounded-md relative hover:opacity-90"
          @click="getUserNotMe"
        >
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    </div>

    <div
      v-if="showUsers"
      ref="userListRef"
      class="mt-2 border p-2 rounded-md absolute bg-white text-black"
    >
      <div v-if="!userStore.isLoading">
        <div v-if="userStore.users.length > 0" class="space-y-2">
          <div
            v-for="user in userStore.users"
            :key="user.id"
            class="flex items-center gap-2 border-b pb-2"
            @click="goMessage(user.id)"
          >
            <img
              :src="user.user_avt || 'https://via.placeholder.com/50'"
              alt="avatar"
              class="w-10 h-10 rounded-full object-cover"
            />
            <span>{{ user.name }}({{ user.employeeId }})</span>
            <span></span>
          </div>
        </div>
        <div v-else class="text-gray-500 text-sm">Không có người dùng nào!</div>
      </div>
      <div v-else><Loading /></div>
    </div>
    <Conversations />
  </div>
</template>
