<script setup>
import { reactive, ref } from "vue";
import { FwbButton, FwbModal } from "flowbite-vue";
import { useUserStore } from "@/stores/user.store";
import * as yup from "yup";
import Loading from "./Loading.vue";
import { useToast } from "vue-toast-notification";
import { useRouter } from "vue-router";
import { Form, Field, ErrorMessage } from "vee-validate";

import InputOtp from "primevue/inputotp";

const userStore = useUserStore();
const router = useRouter();
const $toast = useToast();
const timeout = ref(false);
const otpError = ref(false);
const forgot = reactive({
  email: "",
});

const data = reactive({
  email: "",
  newPassword: "",
  code: "",
});

const sendVerityCode = async () => {
  console.log(forgot);
  await userStore.verifyCode(forgot);
  if (userStore.err) {
    $toast.error(userStore.err, { position: "top-right" });
    return;
  }
  timeout.value = true;
  data.code = "";
  data.email = forgot.email;
  otpError.value = false; // Reset lỗi OTP khi gửi lại mã
};

const resetPassword = async () => {
  await userStore.forgotPassword(data);
  if (userStore.err) {
    $toast.error(userStore.err, { position: "top-right" });
    otpError.value = true;
    return;
  }
  $toast.success("Đặt lại mật khẩu thành công", { position: "top-right" });
  timeout.value = false;
  data.email = "";
  forgot.email = "";
  setTimeout(() => {
    router.push("login");
  }, 1000);
  userStore.closeForgotPassword();
};
const formSchemaPassword = yup.object().shape({
  newPassword: yup
    .string()
    .required("Mật khẩu phải có giá trị.")
    .min(6, "Mật khẩu phải ít nhất 6 ký tự."),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref("newPassword"), null],
      "Mật khẩu xác nhận không trùng khớp."
    ),
});
const validationSchema = yup.object({
  email: yup
    .string()
    .required("Email không được bỏ trống.")
    .email("Email không đúng định dạng."),
});
</script>

<style scoped>
.loading {
  text-align: -webkit-center;
}
.border-red-500 {
  width: 40px;
  font-size: 20px;
  border: 0 none;
  appearance: none;
  text-align: center;
  transition: all 0.2s;
  background: transparent;
  border-bottom: 2px solid rgb(219, 15, 8);
}
.custom-otp-input {
  width: 40px;
  font-size: 20px;
  border: 0 none;
  outline: none;
  appearance: none;
  text-align: center;
  transition: all 0.2s;
  background: transparent;
  border-bottom: 2px solid rgb(74, 58, 223);
}
.border-red-500:focus {
  outline: none;
  --tw-ring-shadow: none;
}
.custom-otp-input:focus {
  outline: none;
  --tw-ring-shadow: none;
}
</style>

<template>
  <fwb-modal
    v-if="userStore.isShow.forgotPassword"
    @close="userStore.closeForgotPassword"
    size="xl"
  >
    <template #header>
      <div class="flex items-center text-lg">QUÊN MẬT KHẨU</div>
    </template>
    <template #body>
      <div v-if="!userStore.isLoading && data.email == ''">
        <Form :validationSchema="validationSchema" @submit="sendVerityCode">
          <label for="email" class="block text-sm text-gray-500">Email</label>
          <Field
            type="text"
            name="email"
            id="emailForgot"
            class="w-full block bg-transparent border-b border-gray-300 focus:ring-transparent focus:border-gray-500 text-black text-base py-2 rounded-lg"
            placeholder="Nhập email"
            v-model="forgot.email"
          />
          <ErrorMessage name="email" class="error" />
        </Form>
      </div>
      <div v-if="timeout == true && !userStore.isLoading">
        <Form
          class="flex flex-col gap-4"
          @submit="resetPassword"
          :validation-schema="formSchemaPassword"
        >
          <div>
            <label for="newPassword" class="block text-sm text-gray-500"
              >Mật khẩu mới</label
            >
            <Field
              type="password"
              name="newPassword"
              id="newPassword"
              class="input-custom shadow-lg"
              v-model="data.newPassword"
            />
            <ErrorMessage name="newPassword" class="error" />
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm text-gray-500"
              >Xác nhận lại mật khẩu</label
            >
            <Field
              name="confirmPassword"
              type="password"
              id="confirmPassword"
              class="input-custom shadow-lg"
            />
            <ErrorMessage name="confirmPassword" class="error" />
          </div>

          <div class="card flex flex-col">
            <label class="block text-sm text-gray-500">Nhập OTP</label>
            <InputOtp v-model="data.code" :length="5" integerOnly>
              <template #default="{ attrs, events }">
                <input
                  type="text"
                  v-bind="attrs"
                  v-on="events"
                  :class="{
                    'border-red-500': otpError,
                    'custom-otp-input': !otpError,
                  }"
                />
              </template>
            </InputOtp>

            <!-- <input v-model="data.code" type="number" name="" id="" /> -->
          </div>
          <div class="mt-2 text-center font-medium">
            Bạn chưa nhận được mã?
            <p
              class="inline-block text-blue-800 cursor-pointer"
              @click="sendVerityCode"
            >
              Gửi lại yêu cầu.
            </p>
          </div>
        </Form>
      </div>
      <div v-if="userStore.isLoading" class="loading">
        <Loading />
      </div>
    </template>
    <template #footer>
      <div v-if="timeout == false && !userStore.isLoading">
        <div class="flex justify-between">
          <button
            type="submit"
            class="w-full bg-blue-700 text-white cursor-pointer py-2 px-4 rounded-md hover:bg-blue-600"
            :disabled="!forgot.email"
          >
            NHẬN MÃ XÁC MINH
          </button>
        </div>
        <div class="mt-2 text-center font-medium">
          Bạn đã nhớ mật khẩu?
          <p
            class="inline-block text-blue-800 cursor-pointer"
            @click="userStore.closeForgotPassword"
          >
            Trở về đăng nhập.
          </p>
        </div>
      </div>
      <button
        type="submit"
        v-else-if="timeout == true"
        class="w-full bg-blue-700 cursor-pointer text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Đặt lại mật khẩu
      </button>
    </template>
  </fwb-modal>
</template>
