<script setup>
import { ref, reactive } from "vue";
import { FwbButton, FwbModal } from "flowbite-vue";
import { useUserStore } from "@/stores/user.store";
import { useManageStore } from "@/stores/manage.store";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "vue-toast-notification";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import Loading from "../../common/Loading.vue";
const user = reactive({
  name: "",
  email: "",
  password: "",
  employeeId: "",
  role: "",
});
const manageStore = useManageStore();
const userStore = useUserStore();
const useAuth = useAuthStore();
const $toast = useToast();
const formSchemaUser = yup.object().shape({
  name: yup
    .string()
    .required("Tên không được bỏ trống.")
    .min(8, "Tên phải ít nhất 8 ký tự.")
    .max(50, "Tên có nhiều nhất 50 ký tự."),
  email: yup
    .string()
    .required("Email không được bỏ trống")
    .email("Email không đúng định dạng"),
  employeeId: yup
    .string()
    .required("MSSV phải có giá trị.")
    .max(10, "MSSV tối đa 10 ký tự."),
  password: yup
    .string()
    .required("Mật khẩu phải có giá trị.")
    .min(6, "Mật phải ít nhất 6 ký tự."),
});
const resetForm = () => {
  user.name = "";
  user.email = "";
  user.password = "";
  user.employeeId = "";
  user.role = "";
};

const addUser = async (user) => {
  await useAuth.register(user);
  if (useAuth.err) {
    $toast.error(useAuth.err, { position: "top-right" });
    return;
  }
  $toast.success(useAuth.result.message, { position: "top-right" });
  resetForm();
  await userStore.getAllUser({
    page: userStore.currentPage,
    name: userStore.name,
    isBan: userStore.isBan,
    role: userStore.role,
  });
  manageStore.closeAddUserModal();
};
</script>
<template>
  <Form
    v-if="manageStore.isShow.addUser"
    @submit="addUser"
    :validation-schema="formSchemaUser"
  >
    <fwb-modal
      @close="manageStore.closeAddUserModal"
      :persistent="true"
      class=""
    >
      <template #header class="">
        <div class="flex items-center text-lg text-black">
          <i class="fa-solid fa-user-plus mr-2"></i>Thêm tài khoản
        </div>
      </template>
      <template #body>
        <div v-if="!userStore.isLoading" class="w-full">
          <label for="email" class="label-custom">Email:</label>
          <Field
            type="text"
            name="email"
            id="email"
            class="input-custom w-auto pl-2"
            v-model="user.email"
          >
          </Field>
          <ErrorMessage name="email" class="error" />
          <label for="name" class="label-custom">Họ và tên:</label>
          <Field
            type="text"
            name="name"
            id="name"
            class="input-custom w-auto pl-2"
            v-model="user.name"
          >
          </Field>
          <ErrorMessage name="name" class="error" />
          <label for="employeeId" class="label-custom">Mã nhân viên:</label>
          <Field
            type="text"
            name="employeeId"
            id="employeeId"
            class="input-custom w-auto pl-2"
            v-model="user.employeeId"
          >
          </Field>
          <ErrorMessage name="employeeId" class="error" />
          <label for="password" class="label-custom">Mật khẩu:</label>
          <Field
            type="password"
            name="password"
            id="password"
            class="input-custom w-auto pl-2"
            v-model="user.password"
          >
          </Field>
          <ErrorMessage name="password" class="error" />
          <label for="role" class="label-custom">Vai trò:</label>
          <Field
            as="select"
            name="role"
            id="role"
            class="input-custom w-auto pl-2"
            v-model="user.role"
          >
            <option value="">Chọn vai trò</option>
            <option :value="1">Nhân viên quản lý</option>
            <option :value="2">Nhân viên kỹ thuật</option>
          
          </Field>
          <ErrorMessage name="role" class="error" />
        </div>
        <div v-else>
          <Loading />
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <fwb-button color="green">Thêm</fwb-button>
          <fwb-button
            @click="manageStore.closeAddUserModal"
            color="alternative"
          >
            Huỷ
          </fwb-button>
        </div>
      </template>
    </fwb-modal></Form
  >
</template>
