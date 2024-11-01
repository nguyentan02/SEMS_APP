<script setup>
import { FwbButton, FwbModal } from "flowbite-vue";
import { useManageStore } from "../../../stores/manage.store";
import { ref, watch } from "vue";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
const manageStore = useManageStore();

const props = defineProps(["user"]);
const emits = defineEmits(["user"]);
const formSchemaFeedback = yup.object().shape({
  feedback: yup
    .string()
    .required("Phải có giá trị.")
    .min(10, "Ít nhất 10 ký tự.")
    .max(250, "Tên có nhiều nhất 250 ký tự."),
});

const feedback = ref("");
const time = ref(1);
const sumitFeedback = () => {
  emits("user", {
    user: props.user,
    feedback: feedback.value,
    time: time.value,
  });
  feedback.value = "";
  time.value = 1;
};
</script>

<template>
  <Form
    v-if="manageStore.isShow.feedback"
    @submit="sumitFeedback"
    :validation-schema="formSchemaFeedback"
  >
    <fwb-modal @close="manageStore.closeFeedbackModal" :persistent="true">
      <template #header>
        <div class="flex items-center text-lg text-black">Khoá tài khoản</div>
      </template>
      <template #body>
        <div>
          <div class="flex gap-2 items-center mb-2">
            <label for="name" class="label-custom"> Họ và tên: </label>
            <Field
              name="name"
              id="name"
              type="text"
              class="w-9/12 bg-[rgb(var(--color-primary))] border-none rounded-lg"
              v-model="props.user.name"
              disabled
            />
          </div>
          <div class="flex gap-2 items-center">
            <label for="email" class="mr-8 label-custom"> Email: </label>
            <Field
              name="email"
              id="email"
              type="text"
              class="w-9/12 bg-[rgb(var(--color-primary))] border-none rounded-lg"
              v-model="props.user.email"
              disabled
            />
          </div>
          <div class="mt-3">
            <label for="time" class="label-custom">Thời gian khóa:</label>
            <Field
              as="select"
              name="time"
              id="time"
              class="input-custom w-auto"
              v-model="time"
            >
              <option :value="1">1 ngày</option>
              <option :value="7">7 ngày</option>
              <option :value="14">15 ngày</option>
              <option :value="30">30 ngày</option>
              <option :value="-1">Vĩnh viễn</option>
            </Field>
            <ErrorMessage name="time" class="error" />
            <label for="time" class="label-custom">Lý do khóa:</label>
            <Field
              name="feedback"
              id="feedback"
              as="textarea"
              class="w-full rounded-md"
              placeholder="Nhập lý do khóa"
              v-model="feedback"
              rows="5"
            />
            <ErrorMessage name="feedback" class="error" />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <fwb-button color="red"> Khoá </fwb-button>
          <fwb-button
            @click="manageStore.closeFeedbackModal"
            color="alternative"
          >
            Huỷ
          </fwb-button>
        </div>
      </template>
    </fwb-modal>
  </Form>
</template>
