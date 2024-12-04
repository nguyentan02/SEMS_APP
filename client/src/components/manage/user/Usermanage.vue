<script setup>
import { onMounted, ref, watch, watchEffect } from "vue";
import { FwbPagination } from "flowbite-vue";
import { useUserStore } from "../../../stores/user.store";
import { useToast } from "vue-toast-notification";
import { useManageStore } from "@/stores/manage.store";
import FeedbackModal from "./FeedbackModal.vue";
import HistoryModal from "./HistoryModal.vue";
import AddUserModal from "./AddUserModal.vue";
import EditUserModal from "./EditUserModal.vue";
import Loading from "@/components/common/Loading.vue";
import dayjs from "dayjs";
import Seach from "@/components/common/Seach.vue";
const userStore = useUserStore();
const manageStore = useManageStore();
const emit = defineEmits(["currentPage"]);
const currentUser = ref(null);

const $toast = useToast();
const banUser = async (user, feedback, time) => {
  const conFirm = confirm(`Bạn có chắc chắn khóa?`);
  if (conFirm) {
    await userStore.banUser(user.id, { feedback: feedback, time: time });

    if (userStore.err) {
      $toast.error(userStore.err, { position: "top-right" });
      return;
    }
    $toast.success(userStore.result.message, { position: "top-right" });
    await userStore.getAllUser({
      page: userStore.currentPage,
      name: userStore.name,
      isBan: userStore.isBan,
      role: userStore.role,
    });
    manageStore.closeFeedbackModal();
  }
};
const unBanUser = async (id) => {
  const conFirm = confirm(`Bạn có chắc chắn muốn mở khoá?`);
  if (conFirm) {
    await userStore.unBanUser(id);
    if (userStore.err) {
      $toast.error(userStore.err, { position: "top-right" });
      return;
    }
    $toast.success(userStore.result.message, { position: "top-right" });
    await userStore.getAllUser({
      page: userStore.currentPage,
      name: userStore.name,
      isBan: userStore.isBan,
      role: userStore.role,
    });
  }
};
watchEffect(async () => {
  await userStore.getAllUser({
    page: userStore.currentPage,
    name: userStore.name,
    isBan: userStore.isBan,
    role: userStore.role,
  });
});
onMounted(async () => {
  emit("currentPage", "user");
  await userStore.getAllUser({ page: 1 });
  userStore.currentPage = 1;
  userStore.name = "";
});
</script>
<template>
  <h1 class="text-2xl font-bold my-10">Quản lý thành viên</h1>
  <div class="flex items-center justify-between mb-5">
    <Seach
      :title="'Nhập tên'"
      class="border border-gray-400"
      @key="
        (e) => {
          userStore.name = e;
        }
      "
    />
    <div class="">
      <label for="isban">Trạng thái: </label>
      <select
        name=""
        id="isban"
        class="rounded-xl p-1 bg-[rgb(var(--color-primary))]"
        v-model="userStore.isBan"
      >
        <option value="null">Tất cả</option>
        <option value="false">Hoạt động</option>
        <option value="true">Khóa</option>
      </select>
    </div>
    <div class="">
      <label for="role">Vai trò: </label>
      <select
        name=""
        id="role"
        class="rounded-xl p-1 bg-[rgb(var(--color-primary))]"
        v-model="userStore.role"
      >
        <option value="null">Tất cả</option>
        <option :value="1">Nhân viên quản lý</option>
        <option :value="2">Nhân viên kỹ thuật</option>
      </select>
    </div>
    <div>
      <button
        class="p-2 px-8 bg-emerald-600 rounded-lg transition duration-300 ease-in-out hover:bg-emerald-400"
        @click="manageStore.showAddUserModal"
      >
        <i class="fa-solid fa-user-plus text-white"></i>
      </button>
    </div>
  </div>
  <table
    class="bg-[rgb(var(--color-primary))] table-auto w-full text-sm text-left rounded-md"
  >
    <thead class="border-b border-black font-medium">
      <tr class="text-left">
        <th class="p-2">Thành viên</th>
        <th class="p-2">Email</th>
        <th class="p-2 text-center">Ngày tham gia</th>
        <th class="p-2">Vai trò</th>
        <th class="p-2 text-center">Trạng thái</th>
        <th class="p-2 text-center">Tùy chọn</th>
      </tr>
    </thead>
    <tbody v-if="!userStore.isLoading">
      <tr
        v-if="userStore.users?.length"
        v-for="(user, i) in userStore.users"
        :key="user.id"
        class="border-b transition duration-300 ease-in-out hover:bg-[#bbb8b8]"
      >
        <td class="flex items-center whitespace-nowrap ml-2 mt-[10px]">
          <div
            class="w-10 h-10 overflow-hidden flex items-center justify-center rounded-full mt-2"
          >
            <img :src="user.user_avt" alt="logo" />
          </div>
          <span class="items-center ml-2">{{ user.name }}</span>
        </td>
        <td class="text-left">
          {{ user.email }}
        </td>
        <!-- <td class="whitespace-nowrap  truncate">
          <router-link
            :to="{ name: 'profile', params: { id: `${user.id}` } }"
            class="text-lg text-blue-500  hover:text-blue-600"
          >
            {{ user.name }}
          </router-link>
        </td> -->
        <td class="text-center">
          {{ dayjs(user.createdAt).format("L") }}
        </td>
        <td class="">
          <p>
            {{
              user.role === 1
                ? "Nhân viên quản lý"
                : user.role === 2
                ? "Nhân viên kỹ thuật"
                : "Nhân viên kho"
            }}
          </p>
        </td>
        <td
          v-if="!user.isBan"
          class="whitespace-nowrap text-green-500 text-center"
        >
          Hoạt động
        </td>
        <td v-else class="whitespace-nowrap text-red-500 text-center">Khóa</td>
        <td class="whitespace-nowrap flex items-center justify-center">
          <button
            v-if="!user.isBan"
            class="p-2 text-red-600 hover:text-red-700 text-2xl"
            @click="
              () => {
                manageStore.showFeedbackModal();
                currentUser = user;
              }
            "
          >
            <i class="fa-solid fa-lock"></i>
          </button>
          <button
            v-else
            class="p-2 text-orange-400 hover:text-orange-500 text-2xl"
            @click="
              async () => {
                await unBanUser(user.id);
              }
            "
          >
            <i class="fa-solid fa-unlock"></i>
          </button>
          <button
            class="p-2 text-yellow-300 hover:text-yellow-400 text-2xl"
            @click="
              () => {
                manageStore.showEdituserModal();
                currentUser = user;
              }
            "
          >
            <i class="fa-solid fa-user-pen"></i>
          </button>
          <button
            class="p-2 text-white hover:text-gray-600 text-2xl"
            @click="
              () => {
                manageStore.showHistoryModal();
                currentUser = user;
              }
            "
          >
            <i class="fa-regular fa-eye"></i>
          </button>
        </td>
      </tr>
      <tr v-else class="text-center text-red-500 text-xl">
        <td colspan="7">Không có.</td>
      </tr>
    </tbody>
    <tbody v-else>
      <tr class="text-center text-red-500 text-xl">
        <td class="absolute right-[45%]">
          <Loading />
        </td>
      </tr>
    </tbody>
  </table>
  <div class="w-full text-center mt-2" v-if="userStore.totalPages >= 2">
    <FwbPagination
      v-model="userStore.currentPage"
      :total-pages="userStore.totalPages"
      :show-icons="true"
      :show-labels="false"
    />
  </div>
  <EditUserModal :user="currentUser" />
  <FeedbackModal
    :user="currentUser"
    @user="
      async (e) => {
        await banUser(e.user, e.feedback, e.time);
      }
    "
  />
  <AddUserModal />
  <HistoryModal :user="currentUser" />
</template>
