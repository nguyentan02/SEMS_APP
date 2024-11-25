<script setup>
import { useConversationStore } from "../../stores/conversation.store";
import { useUserStore } from "../../stores/user.store";
import { getSender } from "../../untils";
import dayjs from "dayjs";

const conversationStore = useConversationStore();
const userStore = useUserStore();
// console.log(conversationStore.searchResult);
</script>

<template>
  <div
    class="flex-1 mt-2 overflow-y-scroll no-scrollbar border-2 rounded-md p-2"
  >
    <div
      v-for="(conversation, index) in conversationStore.searchResult"
      :key="conversation.id"
      class="p-1 flex text-black mb-1 cursor-pointer gap-2 bg-white rounded items-center overflow-hidden"
      @click="
        () => {
          conversationStore.activeIndex = index;
          if (
            conversationStore.conversations[conversationStore.activeIndex]
              .Message &&
            conversationStore.conversations[conversationStore.activeIndex]
              .Message[0].read == false &&
            conversationStore.conversations[conversationStore.activeIndex]
              .Message[0].userId !== userStore.user.id
          ) {
            conversationStore.conversations[
              conversationStore.activeIndex
            ].Message[0].read = true;
            conversationStore.totalReadMessage =
              conversationStore.totalReadMessage - 1;
          }
        }
      "
      :class="
        conversationStore.activeIndex == index
          ? ' border-2 border-blue-600 '
          : ' border-b-[1px]'
      "
    >
      <div
        class="h-[45px] w-[45px] rounded-full overflow-hidden border shrink-0"
      >
        <img
          alt="avatar"
          class="h-full w-full"
          :src="getSender(userStore.user, conversation.User)?.user_avt"
        />
      </div>
      <div class="flex flex-col w-[100%] gap-2 justify-between py-1">
        <div class="flex justify-between items-center">
          <h2 class="text-base font-semibold truncate max-w-[150px]">
            {{ getSender(userStore.user, conversation.User)?.name }}
          </h2>
          <h2
            v-if="
              conversation?.Message &&
              conversation?.Message[0]?.read == false &&
              conversation?.Message[0]?.userId !== userStore.user?.id
            "
            class="bg-red-500 rounded-full w-3 h-3"
          ></h2>
        </div>
        <div
          class="flex text-sm w-[100%] justify-between"
          v-if="conversation?.Message?.length"
        >
          <div
            class="truncate w-[80%] basis-2/3"
            :class="
              userStore.user?.id === conversation.Message[0]?.userId
                ? ''
                : 'text-yellow-400'
            "
          >
            {{
              userStore.user.id === conversation.Message[0].userId
                ? "Bạn: "
                : ""
            }}
            {{
              conversation.Message[0].isImage
                ? "[Hình ảnh]"
                : conversation.Message[0].content
            }}
          </div>
          <div class="text-xs hidden lg:block">
            {{
              dayjs().diff(dayjs(conversation.Message[0].createdAt), "day") > 0
                ? dayjs(conversation.Message[0].createdAt).format("L")
                : dayjs(conversation.Message[0].createdAt).fromNow()
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
