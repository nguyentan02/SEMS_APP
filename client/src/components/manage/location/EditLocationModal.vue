<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, nextTick, watchEffect } from "vue";
import * as yup from "yup";
import { FwbButton, FwbModal } from "flowbite-vue";
import { useManageStore } from "@/stores/manage.store";
import { useToast } from "vue-toast-notification";
import { useLocationStore } from "@/stores/location.store";
import Loading from "../../common/Loading.vue";

const manageStore = useManageStore();
const locationStore = useLocationStore();
const $toast = useToast();
const props = defineProps(["location"]);
const rooms = ref([]);
const data = reactive({
  deparmentName: "",
  symbol: "",
  roomName: [],
});

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
  return [...rooms.value.map((room) => room.name)].filter((name) => name);
};

const updateDepartment = async () => {
  data.roomName = getRoomNames();
  await locationStore.updateDepartment(data, props.location?.id);
  if (locationStore.err) {
    $toast.error(locationStore.err, { position: "top-right" });
    return;
  }
  $toast.success(locationStore.result.message, { position: "top-right" });
  await locationStore.getLocations({ key: "", page: 1 });
  manageStore.closeEditLocationModal();
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

const removeRoom = (index, fromExisting = false) => {
  if (fromExisting) {
    props.location.rooms.splice(index, 1);
  } else {
    rooms.value.splice(index, 1);
  }
};

watchEffect(() => {
  if (props.location) {
    data.deparmentName = props.location.deparmentName;
    data.symbol = props.location.symbol;
    rooms.value = props.location.rooms.map((room) => ({
      id: room.id,
      name: room.roomName,
    }));
  }
});
</script>

<template>
  <Form
    v-if="manageStore.isShow.editLocation"
    @submit="updateDepartment"
    :validation-schema="formSchemaLocation"
  >
    <fwb-modal @close="manageStore.closeEditLocationModal" :persistent="true">
      <template #header>
        <div class="flex items-center text-lg">Cập nhật phòng ban</div>
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

          <!-- Existing Rooms from props.location -->
          <!-- <div
            v-for="(room, index) in props.location.rooms"
            :key="'existing-' + room.id"
            class="flex items-center gap-2"
          >
            <Field
              type="text"
              :id="'room-' + room.id"
              :name="'room-' + index"
              v-model="room.roomName"
              class="w-auto input-form my-1"
              placeholder="Tên phòng"
            />
            <button
              type="button"
              @click="removeRoom(index, true)"
              class="text-red-500"
            >
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div> -->

          <!-- New Rooms added in the current session -->
          <div
            v-for="(room, index) in rooms"
            :key="'new-' + room.id"
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
          <fwb-button color="green">Cập nhật </fwb-button>
          <fwb-button
            @click="manageStore.closeEditLocationModal"
            color="alternative"
          >
            Huỷ
          </fwb-button>
        </div>
      </template>
    </fwb-modal>
  </Form>
</template>
