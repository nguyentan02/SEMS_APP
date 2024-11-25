<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, nextTick } from "vue";
import * as yup from "yup";
import { FwbButton, FwbModal } from "flowbite-vue";
import { useManageStore } from "@/stores/manage.store";
import { useToast } from "vue-toast-notification";
import { FwbTextarea } from "flowbite-vue";
import { useCategoryStore } from "@/stores/category.store";
import Loading from "../../common/Loading.vue";
const manageStore = useManageStore();
const categoryStore = useCategoryStore();
const $toast = useToast();
const attributesName = ref([]);
const data = reactive({
  categoryName: "",
  description: "",
  attributes: [],
});
// const roomName = ref([]);
const formSchemaLocation = yup.object().shape({
  categoryName: yup
    .string()
    .required("Tên phải có giá trị.")
    .max(50, "Tên có nhiều nhất 50 ký tự."),
});
const getRoomNames = () => {
  return attributesName.value
    .map((attribute) => ({ name: attribute.name }))
    .filter((attribute) => attribute.name && attribute.name.trim() !== "");
};
const createDepartment = async () => {
  data.attributes = getRoomNames();
  console.log(data);
  await categoryStore.createCategory(data);
  if (categoryStore.err) {
    $toast.error(categoryStore.err, { position: "top-right" });
    return;
  }
  $toast.success(categoryStore.result.message, { position: "top-right" });
  data.categoryName = "";
  data.description = "";
  data.attributes = [];
  attributesName.value = [];
  await categoryStore.getCategory({ name: "", page: 1 });
  manageStore.closeAddCategoryModal();
};

const addRoom = async () => {
  if (
    attributesName.value.length > 0 &&
    !attributesName.value[attributesName.value.length - 1].name
  ) {
    attributesName.value[attributesName.value.length - 1].inputRef?.focus();
    return;
  }

  attributesName.value.push({ id: Date.now(), name: "", inputRef: null });
  await nextTick();

  const newInputRef = attributesName.value[attributesName.value.length - 1];
  newInputRef.inputRef = document.querySelector(`#room-${newInputRef.id}`);
  newInputRef.inputRef?.focus();
};
const removeRoom = (index) => {
  attributesName.value.splice(index, 1);
};
</script>

<template>
  <Form
    v-if="manageStore.isShow.addCategory"
    @submit="createDepartment"
    :validation-schema="formSchemaLocation"
  >
    <fwb-modal @close="manageStore.closeAddCategoryModal" :persistent="true">
      <template #header>
        <div class="flex items-center text-lg text-black">Thêm danh mục</div>
      </template>
      <template #body>
        <div v-if="!categoryStore.isLoading" class="w-full">
          <label for="categoryName" class="label-custom">Tên danh mục:</label>
          <Field
            type="text"
            name="categoryName"
            id="categoryName"
            class="input-custom w-auto"
            v-model="data.categoryName"
          >
          </Field>
          <ErrorMessage name="categoryName" class="error" />
          <fwb-textarea
            v-model="data.description"
            label="Mô tả"
            minlength="10"
            placeholder="Viết mô tả danh mục."
            maxlength="30"
            required
          />

          <label for="attributesName" class="label-custom"
            >Thuộc tính danh mục:</label
          >
          <div
            v-if="attributesName.length"
            v-for="(attribyute, index) in attributesName"
            :key="attribyute.id"
            class="flex items-center gap-2"
          >
            <Field
              type="text"
              :id="'room-' + attribyute.id"
              :name="'room-' + index"
              v-model="attribyute.name"
              class="w-auto input-form my-1 text-black"
              placeholder="Thuộc tính "
            />
            <button
              type="button"
              @click="removeRoom(index)"
              class="text-red-500"
            >
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
          <a
            @click="addRoom"
            class="text-blue-500 cursor-pointer hover:text-blue-400"
            >Thêm thuộc tính</a
          >
        </div>
        <div v-else>
          <Loading />
        </div>
      </template>

      <template #footer>
        <div class="flex justify-between">
          <fwb-button color="green"> Thêm </fwb-button>
          <fwb-button
            @click="manageStore.closeAddCategoryModal"
            color="alternative"
          >
            Huỷ
          </fwb-button>
        </div>
      </template>
    </fwb-modal></Form
  >
</template>
