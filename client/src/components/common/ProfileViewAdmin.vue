<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { FwbButton } from "flowbite-vue";
import { Form } from "vee-validate";
import Tag from "primevue/tag";
import dayjs from "dayjs";
import { useToast } from "vue-toast-notification";
import UpdateAvatar from "../profile/UpdateAvatar.vue";
import UpdatePassword from "../profile/UpdatePassword.vue";
import Loading from "./Loading.vue";

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const $toast = useToast();

const valueRole =
  userStore.user.role === 0
    ? "Quản trị viên"
    : userStore.user.role === 1
    ? "Quản lý"
    : "Không xác định";

const isEditing = ref(false);
const nameDefault = ref(userStore.user?.name);
const nameInputRef = ref(null);
const toggleEdit = (event) => {
  event.stopPropagation();
  isEditing.value = !isEditing.value;
  //   previousName.value = userStore.user.name;
  nameDefault.value = "";
  nextTick(() => {
    nameInputRef.value?.focus();
  });
};
const handleClickOutside = (event) => {
  const inputElement = document.getElementById("name");
  if (!inputElement.contains(event.target)) {
    isEditing.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
const data = reactive({
  name: userStore.user.name,
});
const updateProflie = async () => {
  await userStore.updateProfile(data, route.params?.id);
  if (userStore.err) {
    $toast.error(userStore.err, { position: "top-right" });
    return;
  }
  $toast.success(userStore.result.message, { position: "top-right" });
  userStore.user.name = data.name;
};
</script>
<style>
.editable {
  outline: none;
  border: none;
  border-bottom: solid 1px red;
}
</style>
<template>
  <h1 class="text-2xl font-bold mb-10 text-[#f9faf8]">Thông tin cá nhân</h1>
  <div class="w-full p-1 lg:w-[80%] mx-auto">
    <div class="rounded p-4 shadow">
      <div class="flex flex-col">
        <div
          class="relative w-[130px]"
          @click="userStore.showUpdateAvatarModal"
        >
          <img
            class="w-32 h-32 border-2 rounded-full object-cover hover:border-indigo-700 cursor-pointer"
            :src="userStore.user.user_avt"
            alt="logo"
          />
          <div
            class="hidden md:flex absolute bottom-4 mb-2 mr-6 bg-black rounded-full h-6 w-6 justify-center items-center text-lg hover:bg-indigo-700 cursor-pointer"
          >
            <i class="fa-solid fa-camera"></i>
          </div>
        </div>
        <div class="flex flex-col gap-2 flex-1">
          <h1 class="font-bold text-xl">
            {{ userStore.user.name }}
          </h1>
        </div>
        <div class="my-5">
          <fwb-button
            color="alternative"
            @click="userStore.showUpdatePasswordModal"
          >
            <i class="fa-solid fa-key"></i>
            <span class="hidden md:inline"> Đổi mật khẩu </span>
          </fwb-button>
        </div>
      </div>
      <Form
        v-if="userStore.isLoadingUpdate == false"
        class=""
        @submit="updateProflie"
      >
        <div class="form-info" :class="{ editable: isEditing }">
          <label class="w-[100px] label" for="name">Họ và tên:</label>
          <input
            ref="nameInputRef"
            class="w-[75%] input-form bg-[rgb(var(--color-primary))]"
            :class="{ input: isEditing }"
            id="name"
            v-model="data.name"
            :disabled="!isEditing"
          />
          <i
            class="fa-regular fa-pen-to-square cursor-pointer absolute right-2"
            @click="toggleEdit"
          ></i>
        </div>
        <div class="form-info">
          <label class="" for="name">Email:</label>
          <p class="w-1/2 input-form ml-2">{{ userStore.user.email }}</p>
        </div>
        <div class="form-info">
          <label class="" for="name">Vai trò:</label>
          <p class="w-1/2 input-form ml-2">
            <Tag class="p-1" severity="info" :value="valueRole"></Tag>
          </p>
        </div>
        <div class="form-info">
          <label class="" for="name"> Tham gia vào ngày:</label>
          <p class="w-1/2 input-form ml-2">
            <span>
              {{
                dayjs(userStore.user.createdAt).format(
                  "DD, MMMM, YYYY HH:mm:ss"
                )
              }}</span
            >
          </p>
        </div>
        <button
          type="submit"
          v-if="!userStore.isLoadingUpdate"
          class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Cập nhật thông tin
        </button>
      </Form>
      <div v-else>
        <Loading />
      </div>
    </div>
  </div>
  <UpdateAvatar />
  <UpdatePassword />
</template>
