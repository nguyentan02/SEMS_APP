<script setup>
import { FwbButton, FwbModal } from "flowbite-vue";
import { useManageStore } from "../../../stores/manage.store";
import { useUserStore } from "@/stores/user.store";
import { ref, watch, watchEffect, reactive } from "vue";
import { useToast } from "vue-toast-notification";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
const manageStore = useManageStore();
const userStore = useUserStore();
const $toast = useToast();
const props = defineProps(["user"]);
const user = reactive({
  name: "",
  employeeId: "",
  role: "",
});
const formSchemaEdit = yup.object().shape({
  name: yup
    .string()
    .required("Tên không được bỏ trống.")
    .min(6, "Tên ít nhất 6 ký tự.")
    .max(50, "Tên có nhiều nhất 50 ký tự."),
  employeeId: yup
    .string()
    .required("Mã nhân viên không được bỏ trống.")
    .min(5, "Ít nhất 5 ký tự.")
    .max(10, "Mã nhân viên có nhiều nhất 10 ký tự."),
});
const submitEdit = async () => {
  await userStore.updateUser(user, props.user?.id);
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
  manageStore.closeEdituserModal();
};
watchEffect(async () => {
  if (props.user) {
    user.email = props.user?.email;
    user.name = props.user?.name;
    user.employeeId = props.user?.employeeId;
    user.role = props.user?.role;
  }
});
</script>

<template>
  <Form
    v-if="manageStore.isShow.editUser"
    @submit="submitEdit"
    :validation-schema="formSchemaEdit"
  >
    <fwb-modal @close="manageStore.closeEdituserModal" :persistent="true">
      <template #header>
        <div class="flex items-center text-lg text-black">
          <i class="fa-solid fa-user-pen mr-2"></i>
          Cập nhật tài khoản
        </div>
      </template>
      <template #body>
        <div class="w-full">
          <div class="">
            <label for="email" class="mr-8 label-custom"> Email: </label>
            <Field
              name="email"
              id="email"
              type="text"
              class="input-custom"
              v-model="user.email"
              disabled
            />
          </div>
          <div class="mb-2">
            <label for="name" class="label-custom"> Họ và tên: </label>
            <Field
              name="name"
              type="text"
              class="input-custom"
              id="name"
              v-model="user.name"
            />
            <ErrorMessage name="name" class="error" />
          </div>
          <div class="">
            <label for="employeeId" class="mr-8 label-custom">
              Mã nhân viên:
            </label>
            <Field
              name="employeeId"
              id="employeeId"
              type="text"
              class="input-custom bg-gray-300 rounded-lg"
              v-model="user.employeeId"
            />
            <ErrorMessage name="employeeId" class="error" />
          </div>
          <div class="mt-3">
            <label for="role" class="label-custom">Vai trò:</label>
            <Field
              as="select"
              name="role"
              id="role"
              class="input-custom w-auto"
              v-model="user.role"
            >
              <option value="">Chọn vai trò</option>
              <option :value="1">Nhân viên quản lý</option>
              <option :value="2">Nhân viên kỹ thuật</option>
              <option :value="3">Nhân viên kho</option>
            </Field>
            <ErrorMessage name="role" class="error" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <fwb-button color="blue"> Cập nhật </fwb-button>
          <fwb-button
            @click="manageStore.closeEdituserModal"
            color="alternative"
          >
            Huỷ
          </fwb-button>
        </div>
      </template>
    </fwb-modal>
  </Form>
</template>
