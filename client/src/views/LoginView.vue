<script setup>
import { useAuthStore } from "@/stores/auth.store";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useToast } from "vue-toast-notification";
import { useUserStore } from "../stores/user.store";
import { useRouter } from "vue-router";
import { reactive } from "vue";
const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();
const $toast = useToast();
const user = reactive({
  email: "",
  password: "",
});
const formSchemaLogin = yup.object().shape({
  email: yup
    .string()
    .required("Email không được bỏ trống")
    .email("Email không đúng định dạng"),
  password: yup
    .string()
    .required("Mật khẩu phải có giá trị.")
    .min(6, "Tên phải ít nhất 6 ký tự."),
});
const submitLogin = async () => {
  await authStore.login(user);
  if (authStore.err) {
    $toast.error(authStore.err, { position: "top-right" });
    return;
  }
  $toast.success(authStore.result.message, { position: "top-right" });

  router.push({ name: "home" });
};
</script>

<template>
  <section class="w-full h-screen flex items-center justify-center bg-gray-100">
    <div
      class="h-full flex flex-col lg:flex-row items-center justify-center gap-6 xl:w-4/5 bg-white shadow-xl"
    >
      <div
        class="w-full h-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white"
      >
        <img
          class="w-3/6 md:w-40 lg:w-full mt-4"
          src="../assets/login.jpg"
          alt=""
        />
        <h1
          class="text-xl md:text-4xl font-semibold italic text-[#0068A3] text-center"
        >
          Hệ thống quản lý thiết bị
        </h1>
        <h1 class="text-lg text-[#0068A3] text-center">cho trường học</h1>
      </div>
      <div
        class="w-full h-full lg:w-9/12 flex flex-col justify-center p-8 bg-[#ebf0f1]"
      >
        <h2 class="text-4xl font-bold mb-5">Đăng nhập</h2>
        <p class="mb-6">
          Chào mừng trở lại! Xin vui lòng nhập email và mật khẩu.
        </p>
        <Form
          class="flex flex-col gap-4"
          @submit="submitLogin"
          :validation-schema="formSchemaLogin"
        >
          <div>
            <label for="email" class="block text-sm text-gray-500">Email</label>
            <Field
              type="text"
              name="email"
              id="email"
              class="input-custom shadow-lg"
              placeholder="Nhập email"
              v-model="user.email"
            />
            <ErrorMessage name="email" class="error" />
          </div>
          <div>
            <label for="password" class="block text-sm text-gray-500"
              >Mật khẩu</label
            >
            <Field
              name="password"
              type="password"
              id="password"
              class="input-custom shadow-lg"
              placeholder="Nhập mật khẩu"
              v-model="user.password"
            />
            <ErrorMessage name="password" class="error" />
          </div>
          <button
            type="submit"
            class="btn-login bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Đăng nhập
          </button>
        </Form>
      </div>
    </div>
  </section>
</template>
