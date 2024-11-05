<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { FwbButton, FwbModal } from "flowbite-vue";
import { useManageDeviceStore } from "@/stores/manageDevice.store";
import { useDeviceStore } from "@/stores/device.store";
import { useToast } from "vue-toast-notification";
import { useCategoryStore } from "@/stores/category.store";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import Loading from "../../common/Loading.vue";
const device = reactive({
  name: "",
  serialNumber: "",
  manufacturer: "",
  purchaseDate: "",
  expirationDate: "",
  price: "",
  categoryId: "",
  attributes: [],
});

const manageDeviceStore = useManageDeviceStore();
const deviceStore = useDeviceStore();
const categoryStore = useCategoryStore();
const $toast = useToast();
const formSchemaUser = yup.object().shape({
  name: yup
    .string()
    .required("Tên phải có giá trị.")
    .min(8, "Tên phải ít nhất 8 ký tự.")
    .max(50, "Tên có nhiều nhất 50 ký tự."),
  serialNumber: yup.string().required("Email không được bỏ trống"),
  manufacturer: yup
    .string()
    .required("MSSV phải có giá trị.")
    .max(10, "MSSV tối đa 10 ký tự."),
  purchaseDate: yup.string().required("Mật khẩu phải có giá trị."),
  expirationDate: yup.date().required("Mật khẩu phải có giá trị."),
  price: yup.number().required("Mật khẩu phải có giá trị."),
  categoryId: yup.number().required("Chọn danh mục"),
});

const url = ref(null);
const selectedFile = ref(null);
const onFileSelected = (e) => {
  selectedFile.value = e.target.files[0];
  url.value = URL.createObjectURL(selectedFile.value);
};

const createDevice = async () => {
  const data = new FormData();
  data.append("name", device.name);
  data.append("serialNumber", device.serialNumber);
  data.append("imageDevice", selectedFile.value);
  data.append("manufacturer", device.manufacturer);
  data.append("purchaseDate", device.purchaseDate);
  data.append("expirationDate", device.expirationDate);
  data.append("price", device.price);
  device.attributes.map((attribute, index) => {
    data.append(`attributes[${index}][id]`, attribute.id);
    data.append(`attributes[${index}][value]`, attribute.value);
  });
  // for (const [key, value] of data.entries()) {
  //   console.log(`${key}: ${value}`);
  // }
  await deviceStore.createDevice(data);
  if (deviceStore.err) {
    $toast.error(deviceStore.err, { position: "top-right" });
    return;
  }
  $toast.success(deviceStore.result.message, { position: "top-right" });

  selectedFile.value = null;
  url.value = null;
  manageDeviceStore.closeAddDeviceModal();
};
onMounted(async () => {
  await categoryStore.getCategory({});
});
watch(
  () => device.categoryId,
  async (newCategoryId) => {
    if (newCategoryId) {
      await categoryStore.getCategoryById(newCategoryId);
      device.attributes = categoryStore.category.map((attr) => ({
        id: attr.id,
        value: "",
      })); // Khởi tạo các thuộc tính rỗng
    } else {
      device.attributes = [];
    }
  }
);
</script>
<template>
  <Form
    v-if="manageDeviceStore.isShow.addDevice"
    @submit="createDevice"
    :validation-schema="formSchemaUser"
  >
    <fwb-modal
      @close="manageDeviceStore.closeAddDeviceModal"
      :persistent="true"
      class=""
    >
      <template #header class="">
        <div class="flex items-center text-lg text-black">
          <i class="fa-solid fa-user-plus mr-2"></i>Thêm thiết bị
        </div>
      </template>
      <template #body>
        <div v-if="!deviceStore.isLoading" class="w-full">
          <label for="name" class="label-custom">Thiết bị:</label>
          <Field
            type="text"
            name="name"
            id="name"
            class="input-custom w-auto"
            v-model="device.name"
          >
          </Field>
          <ErrorMessage name="name" class="error" />
          <label for="serialNumber" class="label-custom">Số serial:</label>
          <Field
            type="text"
            name="serialNumber"
            id="serialNumber"
            class="input-custom w-auto"
            v-model="device.serialNumber"
          >
          </Field>
          <ErrorMessage name="serialNumber" class="error" />
          <label for="manufacturer" class="label-custom">Nhà sản xuất:</label>
          <Field
            type="text"
            name="manufacturer"
            id="manufacturer"
            class="input-custom w-auto"
            v-model="device.manufacturer"
          >
          </Field>
          <ErrorMessage name="manufacturer" class="error" />
          <label for="purchaseDate" class="label-custom">Ngày mua:</label>
          <Field
            type="date"
            name="purchaseDate"
            id="purchaseDate"
            class="input-custom w-auto"
            v-model="device.purchaseDate"
          >
          </Field>
          <ErrorMessage name="purchaseDate" class="error" />
          <label for="expirationDate" class="label-custom">Ngày hết hạn:</label>
          <Field
            type="date"
            name="expirationDate"
            id="expirationDate"
            class="input-custom w-auto"
            v-model="device.expirationDate"
          >
          </Field>
          <ErrorMessage name="expirationDate" class="error" />
          <label for="price" class="label-custom">Giá:</label>
          <Field
            type="number"
            name="price"
            id="price"
            class="input-custom w-auto"
            v-model="device.price"
          >
          </Field>
          <ErrorMessage name="price" class="error" />
          <div
            class="h-36 w-36 border border-gray-400 rounded-sm overflow-hidden"
          >
            <label
              for="user_avt"
              class="cursor-pointer h-full w-full flex justify-center items-center"
            >
              <div v-if="url == null" class="flex flex-col items-center gap-2">
                <img src="/image.png" alt="" class="object-cover" />
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
          <label for="categoryId" class="label-custom">Loại thiết bị:</label>
          <Field
            as="select"
            name="categoryId"
            id="categoryId"
            class="input-custom"
            v-model="device.categoryId"
          >
            <option value="">Chọn trường / khoa</option>
            <option
              v-if="categoryStore.categorys?.length"
              v-for="category in categoryStore.categorys"
              :key="category.id"
              :value="category.id"
            >
              {{ category.categoryName }}
            </option>
          </Field>

          <ErrorMessage name="categoryId" class="error" />
          <div v-if="categoryStore.category?.length" class="mt-4">
            <h3>Các thuộc tính:</h3>
            <div
              v-for="(attribute, index) in categoryStore.category"
              :key="attribute.id"
              class="mb-4"
            >
              <label :for="`attribute-${attribute.id}`" class="label-custom">
                {{ attribute.name }}:
              </label>
              <Field
                v-if="device.attributes[index]"
                v-model="device.attributes[index].value"
                :id="`attribute-${attribute.id}`"
                :name="`attribute-${attribute.name}`"
                class="input-custom"
                :placeholder="`Nhập giá trị cho ${attribute.name}`"
              />
              <ErrorMessage :name="`attribute-${attribute.id}`" class="error" />
            </div>
          </div>
        </div>
        <div v-else>
          <Loading />
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2">
          <fwb-button color="green">Thêm</fwb-button>
          <fwb-button
            @click="manageDeviceStore.closeAddDeviceModal"
            color="alternative"
          >
            Huỷ
          </fwb-button>
        </div>
      </template>
    </fwb-modal></Form
  >
</template>
