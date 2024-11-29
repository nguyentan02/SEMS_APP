<script setup>
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, reactive, nextTick, watchEffect, computed } from "vue";
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
  console.log("Rooms hiện tại:", rooms.value); // Kiểm tra danh sách phòng trước khi lấy tên
  return rooms.value.map((room) => room.name).filter((name) => name !== "");
};

const updateDepartment = async () => {
  data.roomName = getRoomNames();
  console.log(data.roomName);
  await locationStore.updateDepartment(data, props.location?.id);
  if (locationStore.err) {
    $toast.error(locationStore.err, { position: "top-right" });
    return;
  }
  $toast.success(locationStore.result.message, { position: "top-right" });
  await locationStore.getLocations({ key: "", page: 1 });
  manageStore.closeEditLocationModal();
};

const allRooms = computed(() => {
  const uniqueRooms = new Map();

  console.log("Rooms từ props:", props.location.rooms); // Kiểm tra dữ liệu phòng từ props
  (props.location.rooms || []).forEach((room) => {
    uniqueRooms.set(room.roomName, {
      id: room.id,
      name: room.roomName,
      isOld: true,
    });
  });

  rooms.value.forEach((room) => {
    if (!uniqueRooms.has(room.name)) {
      uniqueRooms.set(room.name, {
        id: room.id,
        name: room.name,
        isOld: false,
      });
    }
  });

  console.log("All Rooms:", Array.from(uniqueRooms.values())); // Kiểm tra danh sách phòng cuối cùng
  return Array.from(uniqueRooms.values());
});
const addRoom = async () => {
  if (rooms.value.length > 0 && !rooms.value[rooms.value.length - 1].name) {
    $toast.error("Tên phòng không được để trống!", { position: "top-right" });
    return;
  }

  const newRoom = { id: Date.now(), name: "", inputRef: null };
  rooms.value.push(newRoom);
  console.log("Rooms sau khi thêm:", rooms.value); // Kiểm tra sau khi thêm phòng
  await nextTick();

  const inputRef = document.querySelector(`#room-${newRoom.id}`);
  newRoom.inputRef = inputRef;
  newRoom.inputRef?.focus();
};
const removeRoom = (index, fromExisting = false) => {
  rooms.value.splice(index, 1);
};

const deleteRoom = async (id, index) => {
  try {
    await locationStore.deleteRoom(id); // Gọi API xóa phòng
    if (locationStore.err) {
      $toast.error(locationStore.err, { position: "top-right" });
      return;
    }
    // Xóa phòng cũ khỏi danh sách
    props.location.rooms.splice(index, 1);
    $toast.success("Xóa phòng thành công!", { position: "top-right" });
  } catch (error) {
    $toast.error("Đã xảy ra lỗi khi xóa phòng", { position: "top-right" });
  }
};
watchEffect(() => {
  if (props.location) {
    console.log("props.location:", props.location); // Kiểm tra dữ liệu truyền vào
    data.deparmentName = props.location.deparmentName || "";
    data.symbol = props.location.symbol || "";
    rooms.value = (props.location.rooms || []).map((room) => ({
      id: room.id,
      name: room.roomName,
    }));
    console.log("Khởi tạo rooms:", rooms.value); // Kiểm tra danh sách phòng
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
        <div class="flex items-center text-lg text-black">
          Cập nhật phòng ban
        </div>
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
            v-for="(room, index) in rooms"
            :key="'room-' + room.id"
            class="flex items-center gap-2"
          >
            <Field
              type="text"
              :id="'room-' + room.id"
              :name="'room-' + index"
              v-model="room.name"
              class="w-auto my-1 pl-1 rounded-lg text-black"
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
