<script setup>
import { reactive, ref } from "vue";
import { FwbButton, FwbModal } from "flowbite-vue";
import { useUserStore } from "@/stores/user.store";
import * as yup from "yup";
import Loading from "./Loading.vue";
import { useToast } from "vue-toast-notification";
import { useRouter } from "vue-router";
import { Form, Field, ErrorMessage } from "vee-validate";

const OTP = ref(null);
const reset = reactive({
  newPassword: "",
  confirmPassword: "",
});
const userStore = useUserStore();
const router = useRouter();
const $toast = useToast();
const showOTP = ref(false); // Control visibility of OTP and email input

const sendVerityCode = async () => {
  await userStore.verifyCode(forgot);
  if (userStore.err) {
    $toast.error(userStore.err, { position: "top-right" });
    return;
  }
  showOTP.value = true; // Show OTP input and hide email input
};
const formSchemaPassword = yup.object().shape({
  newPassword: yup
    .string()
    .required("Mật khẩu phải có giá trị.")
    .min(6, "Tên phải ít nhất 6 ký tự.")
    .notOneOf(
      [yup.ref("currentPassword")],
      "Mật khẩu mới không được trùng với mật khẩu hiện tại."
    ),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("newPassword"), null],
      "Mật khẩu xác nhận không trùng khớp."
    ),
});
</script>

<style scoped>
.loading {
  text-align: -webkit-center;
}
</style>

<template>
  <fwb-modal
    v-if="userStore.isShow.resetPassword"
    @close="userStore.closeResetPassword"
    size="xl"
  >
    <template #header>
      <div class="flex items-center text-lg">QUÊN MẬT KHẨU</div>
    </template>

    <template #body>
      <div v-if="!userStore.isLoading">
        <Form
          class="flex flex-col gap-4"
          @submit="submitLogin"
          :validation-schema="formSchemaPassword"
        >
          <div>
            <label for="newPassword" class="block text-sm text-gray-500"
              >Email</label
            >
            <Field
              type="password"
              name="newPassword"
              id="newPassword"
              class="input-custom shadow-lg"
              placeholder="Nhập email"
              v-model="reset.newPassword"
            />
            <ErrorMessage name="newPassword" class="error" />
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm text-gray-500"
              >Mật khẩu</label
            >
            <Field
              name="confirmPassword"
              type="password"
              id="confirmPassword"
              class="input-custom shadow-lg"
              placeholder="Nhập mật khẩu"
              v-model="reset.confirmPassword"
            />
            <ErrorMessage name="confirmPassword" class="error" />
          </div>
        </Form>
      </div>
      <div v-else class="loading">
        <Loading />
      </div>
    </template>
    <template #footer>
      <div class="flex justify-between">
        <fwb-button color="default" class="w-full">
          ĐẶT LẠI MẬT KHẨU
        </fwb-button>
      </div>
      <div class="mt-2 text-center font-medium">
        Bạn đã nhớ mật khẩu?
        <p class="inline-block text-blue-800 cursor-pointer">
          Trở về đăng nhập.
        </p>
      </div>
    </template>
  </fwb-modal>
</template>
