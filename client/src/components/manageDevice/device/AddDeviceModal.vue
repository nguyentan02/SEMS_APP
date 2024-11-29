<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { FwbButton, FwbModal, FwbTooltip } from "flowbite-vue";
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
    .min(4, "Tên phải ít nhất 8 ký tự.")
    .max(50, "Tên có nhiều nhất 50 ký tự."),
  serialNumber: yup.string().required("Số serial không được bỏ trống"),
  manufacturer: yup.string().required("Nhà sản xuất không được bỏ trống."),
  purchaseDate: yup.string().required("Vui lòng chọn ngày."),
  expirationDate: yup.date().required("Vui lòng chọn ngày."),
  price: yup.number().required("Không phải có giá trị."),
  categoryId: yup.string().required("Chọn danh mục"),
  attributes: yup.array().of(
    yup.object().shape({
      id: yup.string().required(),
      value: yup.string().required("Không được bỏ trống."),
    })
  ),
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
  data.append("categoryId", device.categoryId);
  data.append("price", device.price);
  device.attributes.map((attribute, index) => {
    data.append(`attributes[${index}][id]`, attribute.id);
    data.append(`attributes[${index}][value]`, attribute.value);
  });
  for (const [key, value] of data.entries()) {
    console.log(`${key}: ${value}`);
  }
  await deviceStore.createDevice(data);
  if (deviceStore.err) {
    $toast.error(deviceStore.err, { position: "top-right" });
    return;
  }
  $toast.success(deviceStore.result.message, { position: "top-right" });
  await deviceStore.getDevices({ name: "", page: 1 });
  device.name = "";
  device.serialNumber = "";
  device.manufacturer = "";
  device.purchaseDate = "";
  device.expirationDate = "";
  device.price = "";
  device.categoryId = "";
  device.attributes = [];
  url.value = null;
  isResetting = true;

  manageDeviceStore.closeAddDeviceModal();
  setTimeout(() => {
    isResetting = false;
  }, 0);
};
onMounted(async () => {
  await categoryStore.getCategoryAll();
  console.log(categoryStore.categorys);
});
let isResetting = false; // Cờ trạng thái để kiểm soát việc reset

watch(
  () => device.categoryId,
  async (newCategoryId) => {
    if (isResetting) {
      // Nếu đang reset, không cần xử lý
      return;
    }

    if (!newCategoryId) {
      // Khi categoryId bị xóa hoặc null
      device.attributes = []; // Xóa thuộc tính
      return;
    }

    // Lấy thông tin danh mục mới
    await categoryStore.getCategoryById(newCategoryId);
    device.attributes = categoryStore.category.map((attr) => ({
      id: attr.id,
      value: "", // Gán giá trị rỗng cho thuộc tính mới
    }));
  }
);
</script>
<style scoped>
.custom-select {
  max-height: 100px; /* Giới hạn chiều cao */
  overflow-y: auto; /* Thêm thanh cuộn dọc nếu cần */
  width: 100%; /* Đảm bảo nó chiếm toàn bộ chiều rộng cần thiết */
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 4px;
  background-color: #fff;
}
</style>

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
      size="5xl"
    >
      <template #header class="">
        <div class="flex items-center text-lg text-black">
          <i class="fa-solid fa-laptop-file mr-2"></i>Thêm thiết bị
        </div>
      </template>
      <template #body>
        <div v-if="!deviceStore.isLoading" class="w-full">
          <div>
            <div class="flex justify-between items-center mb-5">
              <div class="w-full">
                <label for="name" class="label-custom">Thiết bị:</label>
                <Field
                  type="text"
                  name="name"
                  id="name"
                  class="input-device w-auto"
                  placeholder="Nhập tên thiết bị"
                  v-model="device.name"
                >
                </Field>
                <ErrorMessage name="name" class="error" />
              </div>
              <div
                class="w-[90px] h-[90px] overflow-hidden rounded-sm float-right group"
              >
                <label
                  for="imageDevice"
                  class="cursor-pointer h-full w-full flex justify-center items-center relative"
                >
                  <div
                    v-if="url == null"
                    class="flex flex-col items-center gap-2"
                  >
                    <img src="/image.png" alt="" class="object-cover" />
                  </div>
                  <img
                    v-else
                    :src="url"
                    alt=""
                    class="object-cover border border-gray-400"
                  />
                  <div
                    class="absolute hidden group-hover:block bg-white rounded-full right-1 bottom-2"
                  >
                    <input
                      type="file"
                      hidden
                      id="imageDevice"
                      accept="image/png, image/jpeg"
                      @change="onFileSelected"
                    />
                    <fwb-tooltip placement="bottom">
                      <template #trigger>
                        <i class="fa-regular fa-pen-to-square"></i>
                      </template>
                      <template #content> Chỉnh sửa</template>
                    </fwb-tooltip>
                  </div>
                </label>
              </div>
            </div>
            <span class="font-semibold">Thông tin chung:</span>
            <div class="flex justify-between">
              <div class="grid grid-cols-1 w-1/2">
                <div class="flex items-center mb-4">
                  <label for="serialNumber" class="label-custom mr-10"
                    >Số serial:</label
                  >
                  <div class="w-[70%]">
                    <Field
                      type="text"
                      name="serialNumber"
                      id="serialNumber"
                      class="input-device w-auto"
                      v-model="device.serialNumber"
                    >
                    </Field>
                    <ErrorMessage name="serialNumber" class="error" />
                  </div>
                </div>

                <div class="flex items-center mb-4">
                  <label for="manufacturer" class="label-custom mr-2"
                    >Nhà sản xuất:</label
                  >
                  <div class="w-[70%]">
                    <Field
                      type="text"
                      name="manufacturer"
                      id="manufacturer"
                      class="input-device w-auto"
                      v-model="device.manufacturer"
                    >
                    </Field>
                    <ErrorMessage name="manufacturer" class="error" />
                  </div>
                </div>
                <div class="flex items-center mb-4">
                  <label for="purchaseDate" class="label-custom mr-6"
                    >Ngày mua:</label
                  >
                  <div class="w-[70%]">
                    <Field
                      type="date"
                      name="purchaseDate"
                      id="purchaseDate"
                      class="input-device w-auto"
                      v-model="device.purchaseDate"
                    >
                    </Field>
                    <ErrorMessage name="purchaseDate" class="error" />
                  </div>
                </div>
                <div class="flex items-center mb-4">
                  <label for="expirationDate" class="label-custom mr-2"
                    >Ngày hết hạn:</label
                  >
                  <div class="w-[70%]">
                    <Field
                      type="date"
                      name="expirationDate"
                      id="expirationDate"
                      class="input-device w-auto"
                      v-model="device.expirationDate"
                    >
                    </Field>
                    <ErrorMessage name="expirationDate" class="error" />
                  </div>
                </div>
                <div class="flex items-center">
                  <label for="price" class="label-custom mr-20">Giá:</label>
                  <div>
                    <Field
                      type="number"
                      name="price"
                      id="price"
                      class="input-device w-auto"
                      v-model="device.price"
                    >
                    </Field>
                    <ErrorMessage name="price" class="error" />
                  </div>
                </div>
              </div>
              <div class="w-1/2">
                <label for="categoryId" class="label-custom"
                  >Loại thiết bị:</label
                >
                <Field
                  as="select"
                  name="categoryId"
                  id="categoryId"
                  class="input-custom pl-2"
                  v-model="device.categoryId"
                >
                  <option value="">Loại thiết bị</option>
                  <option
                    v-if="categoryStore.categoryAll?.length"
                    v-for="category in categoryStore.categoryAll"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.categoryName }}
                  </option>
                </Field>

                <ErrorMessage name="categoryId" class="error" />
                <div v-if="device.attributes.length" class="mt-4">
                  <h3>Thuộc tính:</h3>
                  <div
                    v-if="categoryStore.category?.length"
                    v-for="(attribute, index) in categoryStore.category"
                    :key="attribute.id"
                    class="mb-4"
                  >
                    <label
                      :for="`attribute-${attribute.id}`"
                      class="label-custom"
                    >
                      {{ attribute.name }}:
                    </label>
                    <Field
                      v-if="device.attributes[index]"
                      v-model="device.attributes[index].value"
                      :id="`attribute-${attribute.id}`"
                      :name="`attribute-${attribute.name}`"
                      class="input-device"
                      :placeholder="`Nhập giá trị cho ${attribute.name}`"
                    />
                    <ErrorMessage
                      :name="`attributes.${index}.value`"
                      class="error"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <Loading />
        </div>
      </template>
      <template #footer>
        <div class="flex gap-2 justify-end">
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
