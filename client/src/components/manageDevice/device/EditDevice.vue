<script setup>
import { ref, reactive, onMounted, watch, watchEffect, computed } from "vue";
import {
  FwbButton,
  FwbModal,
  FwbTooltip,
  FwbBreadcrumb,
  FwbBreadcrumbItem,
} from "flowbite-vue";
import { useManageDeviceStore } from "@/stores/manageDevice.store";
import { useDeviceStore } from "@/stores/device.store";
import { useToast } from "vue-toast-notification";
import { useCategoryStore } from "@/stores/category.store";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import Loading from "../../common/Loading.vue";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { useRouter } from "vue-router";

const router = useRouter();
// const props = defineProps(["device"]);
const props = defineProps({
  id: String,
});
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
const url = ref(null);
const selectedFile = ref(null);
const onFileSelected = (e) => {
  selectedFile.value = e.target.files[0];
  url.value = URL.createObjectURL(selectedFile.value);
};

const manageDeviceStore = useManageDeviceStore();
const deviceStore = useDeviceStore();
const categoryStore = useCategoryStore();
const $toast = useToast();

const deviceEdit = ref(null);
const route = useRoute();
const deviceId = route.params.id;
const emit = defineEmits(["currentPage"]);
onMounted(async () => {
  emit("currentPage");
  await categoryStore.getCategory({});
  await deviceStore.getDeviceById(deviceId);
  deviceEdit.value = deviceStore.device[0];
});
let previousCategoryId = null;
watch(deviceEdit, async (newDeviceEdit) => {
  if (newDeviceEdit) {
    device.name = newDeviceEdit.name;
    device.serialNumber = newDeviceEdit.serialNumber;
    device.manufacturer = newDeviceEdit.manufacturer;
    url.value = newDeviceEdit.image;
    device.purchaseDate = dayjs(newDeviceEdit.purchaseDate).format(
      "YYYY-MM-DD"
    );
    device.expirationDate = dayjs(newDeviceEdit.expirationDate).format(
      "YYYY-MM-DD"
    );
    device.price = newDeviceEdit.price;
    device.categoryId = newDeviceEdit.categoryId;
    previousCategoryId = newDeviceEdit.categoryId;

    device.attributes = newDeviceEdit.DeviceAttributeValues.map((attr) => ({
      id: attr.attributeId,
      name: attr.AttribyutesCategory.name,
      value: attr.value,
    }));
  }
});
const attributesCache = ref({});
watch(
  () => device.categoryId,
  async (newCategoryId) => {
    if (previousCategoryId) {
      attributesCache.value[previousCategoryId] = device.attributes;
    }
    if (newCategoryId && newCategoryId !== previousCategoryId) {
      if (attributesCache.value[newCategoryId]) {
        device.attributes = attributesCache.value[newCategoryId];
      } else {
        await categoryStore.getCategoryById(newCategoryId);
        device.attributes = categoryStore.category.map((attr) => ({
          id: attr.id,
          name: attr.name,
          value: "",
        }));
      }
      previousCategoryId = newCategoryId;
    }
  }
);
const updateDevice = async () => {
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
  await deviceStore.updateDevice(route.params?.id, data);
  if (deviceStore.err) {
    $toast.error(deviceStore.err, { position: "top-right" });
    return;
  }
  $toast.success(deviceStore.result.message, { position: "top-right" });
  await deviceStore.getDevices({ name: "", page: 1 });
  // device.name = "";
  // device.serialNumber = "";
  // device.manufacturer = "";
  // device.purchaseDate = "";
  // device.expirationDate = "";
  // device.price = "";
  // device.categoryId = "";
  // device.attributes = [];
  // selectedFile.value = null;
  // url.value = null;
};
</script>
<template>
  <div class="flex items-center justify-between mb-5">
    <fwb-breadcrumb>
      <fwb-breadcrumb-item
        home
        href="#"
        @click="
          () => {
            router.back();
          }
        "
      >
        Trở về
      </fwb-breadcrumb-item>
      <fwb-breadcrumb-item> {{ deviceEdit?.name }} </fwb-breadcrumb-item>
    </fwb-breadcrumb>
    <fwb-button
      color="green"
      size="sm"
      @click="
        () => {
          router.back();
          manageDeviceStore.showAddDeviceModal();
        }
      "
      >Thêm thiết bị <i class="fa-solid fa-plus"></i
    ></fwb-button>
  </div>
  <div class="border border-gray-200 p-5 bg-white rounded-lg relative">
    <Form @submit="updateDevice">
      <div class="flex items-center text-lg text-[#25861e]">
        <i class="fa-solid fa-circle-info mr-2"></i>Thông tin thiết bị
      </div>
      <div v-if="!deviceStore.isLoading" class="w-full">
        <div>
          <div class="flex justify-between items-center mb-5">
            <div class="w-full">
              <label for="name" class="label-custom">Tên thiết bị:</label>
              <Field
                type="text"
                name="name"
                id="name"
                class="w-auto input-edit"
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
                    class="w-auto input-edit"
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
                    class="w-auto input-edit"
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
                    class="w-auto input-edit"
                    v-model="device.purchaseDate"
                  >
                  </Field>
                  <ErrorMessage name="purchaseDate" class="error" />
                </div>
              </div>
              <div class="flex items-center mb-4">
                <label for="expirationDate" class="label-custom mr-6"
                  >Ngày mua:</label
                >
                <div class="w-[70%]">
                  <Field
                    type="date"
                    name="expirationDate"
                    id="expirationDate"
                    class="w-auto input-edit"
                    v-model="device.expirationDate"
                  >
                  </Field>
                  <ErrorMessage name="expirationDate" class="error" />
                </div>
              </div>
              <div class="flex items-center">
                <label for="price" class="label-custom mr-20">Giá:</label>
                <div class="w-[70%]">
                  <Field
                    type="number"
                    name="price"
                    id="price"
                    class="w-auto input-edit"
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
                class="input-custom"
                v-model="device.categoryId"
              >
                <option value="">Loại thiết bị</option>
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
              <div v-if="device.attributes" class="mt-4">
                <h3>Thuộc tính:</h3>
                <div
                  v-for="(attribute, index) in device.attributes"
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
                    class="input-edit p-2"
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
      <div v-else class="absolute right-1/2">
        <Loading />
      </div>

      <div class="flex gap-2 justify-end">
        <fwb-button color="green"
          ><i class="fa-solid fa-cloud-arrow-up mr-2"></i>Cập nhật</fwb-button
        >
      </div>
    </Form>
  </div>
</template>
