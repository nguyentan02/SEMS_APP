<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, nextTick, watchEffect } from "vue";
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
const props = defineProps(["category"]);
const attributesName = ref([]);
const data = reactive({
  categoryName: "",
  description: "",
  attributes: [],
});
const formSchemaLocation = yup.object().shape({
  categoryName: yup
    .string()
    .required("Tên phải có giá trị.")
    .min(2, "Tên phải ít nhất 2 ký tự.")
    .max(50, "Tên có nhiều nhất 50 ký tự."),
});
const getRoomNames = () => {
  return attributesName.value
    .map((attribute) => ({ id: attribute.id, name: attribute.name }))
    .filter((attribute) => attribute.name && attribute.name.trim() !== "");
};
const updateCategory = async () => {
  data.attributes = getRoomNames();

  await categoryStore.updateCategory(props.category?.id, data);

  if (categoryStore.err) {
    $toast.error(categoryStore.err, { position: "top-right" });
    return;
  }
  $toast.success(categoryStore.result.message, { position: "top-right" });
  await categoryStore.getCategory({ name: "", page: 1 });
  manageStore.closeEditCategoryModal();
};

const addRoom = async () => {
  if (
    attributesName.value.length > 0 &&
    !attributesName.value[attributesName.value.length - 1].name
  ) {
    attributesName.value[attributesName.value.length - 1].inputRef?.focus();
    return;
  }

  attributesName.value.push({ id: null, name: "", inputRef: null });
  await nextTick();

  const newInputRef = attributesName.value[attributesName.value.length - 1];
  newInputRef.inputRef = document.querySelector(`#room-${newInputRef.id}`);
  newInputRef.inputRef?.focus();
};
const removeRoom = (index) => {
  attributesName.value.splice(index, 1);
};
watchEffect(() => {
  if (props.category) {
    data.categoryName = props.category.categoryName;
    data.description = props.category.description;
    attributesName.value = props.category.AttribyutesCategory.map(
      (attribute) => ({
        id: attribute.id,
        name: attribute.name,
      })
    );
  }
});
</script>

<template>
  <Form
    v-if="manageStore.isShow.editCategory"
    @submit="updateCategory"
    :validation-schema="formSchemaLocation"
  >
    <fwb-modal @close="manageStore.closeEditCategoryModal" :persistent="true">
      <template #header>
        <div class="flex items-center text-lg text-black">
          Cập nhật danh mục
        </div>
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
            class="text-black"
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
              class="w-auto pl-1 rounded-lg my-1 text-black"
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
          <fwb-button color="green">Cập nhật </fwb-button>
          <fwb-button
            @click="manageStore.closeEditCategoryModal"
            color="alternative"
          >
            Huỷ
          </fwb-button>
        </div>
      </template>
    </fwb-modal></Form
  >
</template>
