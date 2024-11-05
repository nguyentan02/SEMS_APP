<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, nextTick } from "vue";
import * as yup from "yup";
import { FwbButton, FwbModal, FlowbiteThemable } from "flowbite-vue";
import { useManageStore } from "@/stores/manage.store";
import { useToast } from "vue-toast-notification";

import { useLocationStore } from "@/stores/location.store";
import Loading from "../../common/Loading.vue";
const manageStore = useManageStore();
const locationStore = useLocationStore();
const $toast = useToast();
const rooms = ref([]);
const theme = "blue";
const data = reactive({
  deparmentName: "",
  symbol: "",
  roomName: [],
});
const roomName = ref([]);
const formSchemaLocation = yup.object().shape({
  deparmentName: yup
    .string()
    .required("Tên phải có giá trị.")
    .min(8, "Tên phải ít nhất 8 ký tự.")
    .max(50, "Tên có nhiều nhất 50 ký tự."),
  symbol: yup
    .string()
    .required("Ký hiệu phải có giá trị.")
    .min(2, "Ký hiệu phải ít nhất 2 ký tự."),
});
const getRoomNames = () => {
  return rooms.value.map((room) => room.name).filter((name) => name);
};
const createDepartment = async () => {
  data.roomName = getRoomNames();
  console.log(data);
  await locationStore.createDepartment(data);
  if (locationStore.err) {
    $toast.error(locationStore.err, { position: "top-right" });
    return;
  }
  $toast.success(locationStore.result.message, { position: "top-right" });
  await locationStore.getLocations({ key: "", page: 1 });
  manageStore.closeAddLocationModal();
};

const addRoom = async () => {
  if (rooms.value.length > 0 && !rooms.value[rooms.value.length - 1].name) {
    rooms.value[rooms.value.length - 1].inputRef?.focus();
    return;
  }

  rooms.value.push({ id: Date.now(), name: "", inputRef: null });
  await nextTick();

  const newInputRef = rooms.value[rooms.value.length - 1];
  newInputRef.inputRef = document.querySelector(`#room-${newInputRef.id}`);
  newInputRef.inputRef?.focus();
};
const removeRoom = (index) => {
  rooms.value.splice(index, 1);
};
</script>

<template>
  <Form
    v-if="manageStore.isShow.addLocation"
    @submit="createDepartment"
    :validation-schema="formSchemaLocation"
  >
    <fwb-modal
      :style="{ backgroundColor: '#ffffff' }"
      @close="manageStore.closeAddLocationModal"
      :persistent="true"
    >
      <template #header>
        <div class="flex items-center text-lg text-black">Thêm khoa</div>
      </template>
      <template #body>
        <div v-if="!locationStore.isLoading" class="w-full">
          <label for="deparmentName" class="label-custom">Tên khoa:</label>
          <Field
            type="text"
            name="deparmentName"
            id="departmentName"
            class="input-custom w-auto"
            v-model="data.deparmentName"
          >
          </Field>
          <ErrorMessage name="deparmentName" class="error" />
          <label for="symbol" class="label-custom">Ký hiệu:</label>
          <Field
            type="text"
            name="symbol"
            id="symbol"
            class="input-custom w-auto"
            v-model="data.symbol"
          >
          </Field>
          <ErrorMessage name="symbol" class="error" />
          <label for="rooms" class="label-custom">Phòng:</label>
          <div
            v-if="rooms.length"
            v-for="(room, index) in rooms"
            :key="room.id"
            class="flex items-center gap-2"
          >
            <Field
              type="text"
              :id="'room-' + room.id"
              :name="'room-' + index"
              v-model="room.name"
              class="w-auto input-form my-1"
              placeholder="Tên phòng"
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
            >Thêm phòng</a
          >
        </div>
        <div v-else>
          <Loading />
        </div>
      </template>

      <template #footer>
        <div class="flex justify-between">
          <fwb-button color="green"> I accept </fwb-button>
          <fwb-button
            @click="manageStore.closeAddLocationModal"
            color="alternative"
          >
            Decline
          </fwb-button>
        </div>
      </template>
    </fwb-modal></Form
  >
</template>
