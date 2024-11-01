<script setup>
import { ref } from "vue";
import { FwbButton, FwbModal } from "flowbite-vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../../stores/user.store";
import { useToast } from "vue-toast-notification";
import Loading from "../common/Loading.vue";

const userStore = useUserStore();
const route = useRoute();
const $toast = useToast();
const url = ref(null);
const selectedFile = ref(null);
const onFileSelected = (e) => {
  selectedFile.value = e.target.files[0];
  url.value = URL.createObjectURL(selectedFile.value);
};
const submitImage = async () => {
  if (!selectedFile.value) return;
  const data = new FormData();
  data.append("user_avt", selectedFile.value);
  await userStore.updateAvatar(data);
  if (userStore.err) {
    $toast.error(userStore.err, { position: "top-right" });
    return;
  }
  $toast.success(userStore.result.message, { position: "top-right" });
  userStore.user.user_avt = url.value;
  selectedFile.value = null;
  url.value = null;
  userStore.closeUpdateAvatarModal();
};
</script>
<template>
  <fwb-modal
    v-if="userStore.isShow.updateAvatar"
    @close="userStore.closeUpdateAvatarModal"
  >
    <template #header>
      <div class="flex items-center text-black text-xl gap-2">
        <i class="fa-solid fa-camera"></i>
        Cập nhật ảnh đại diện
      </div>
    </template>
    <template #body>
      <div v-if="!userStore.isLoading" class="w-full flex justify-center">
        <div
          class="h-36 w-36 border-dashed border-black border-2 rounded-full overflow-hidden"
        >
          <label
            for="user_avt"
            class="cursor-pointer h-full w-full flex justify-center items-center"
          >
            <div v-if="url == null" class="flex flex-col items-center gap-2">
              <i class="fa-solid fa-cloud-arrow-up text-black text-2xl"></i>
              Chọn hình ảnh
            </div>
            <img v-else :src="url" alt="" class="object-cover" />
          </label>
        </div>
        <input
          type="file"
          hidden
          id="user_avt"
          accept="image/png, image/jpeg"
          @change="onFileSelected"
        />
      </div>
      <div v-else>
        <Loading />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <fwb-button
          v-if="!userStore.isLoading"
          @click="
            async () => {
              await submitImage();
            }
          "
          color="blue"
        >
          Đổi
        </fwb-button>
        <fwb-button v-else disabled> Đổi </fwb-button>
        <fwb-button
          v-if="!userStore.isLoading"
          @click="userStore.closeUpdateAvatarModal"
          color="red"
        >
          Hủy
        </fwb-button>
        <fwb-button v-else color="red" disabled> Hủy </fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
