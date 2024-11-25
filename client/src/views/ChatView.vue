<script setup>
import SideBar from "../components/chat/SideBar.vue";
import Conversation from "../components/chat/Conversation.vue";
import Footer from "../components/common/Footer.vue";
</script>

<template>
  <div class="w-full p-1 mx-auto pt-2 flex overflow-hidden gap-2 h-[80vh]">
    <SideBar />
    <Conversation />
  </div>
</template>
