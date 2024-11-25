<script setup>
import { useUserStore } from "@/stores/user.store";

const userStore = useUserStore();
const getUserNotMe = async () => {
  await userStore.getUserNotMe();
  console.log(userStore.users);
};
</script>

<template></template>
