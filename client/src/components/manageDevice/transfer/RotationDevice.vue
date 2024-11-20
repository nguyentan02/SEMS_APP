<script setup>
import { onMounted, reactive, ref, watchEffect, watch } from "vue";
import { useRotationDevice } from "@/stores/rotation.store";
import { FwbButton, FwbModal, FwbTextarea } from "flowbite-vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useLocationStore } from "@/stores/location.store";
import { useToast } from "vue-toast-notification";
import { useRoute } from "vue-router";
import { useUsageStore } from "@/stores/usage.store";
const props = defineProps(["selectedDevices", "currentRoomName"]);

const data = reactive({
  deviceId: [],

  newLocationId: "",
  reason: "",
});
const deparmentId = ref(null);
const rotationStore = useRotationDevice();
const locationStore = useLocationStore();
const usageStore = useUsageStore();
const $toast = useToast();
const route = useRoute();
onMounted(async () => {
  await locationStore.getLocations({ key: "", page: "" });
});
watchEffect(async () => {
  if (props.selectedDevices) {
    console.log(props.selectedDevices);
    data.deviceId = props.selectedDevices;
  }
});
const rotation = async () => {
  console.log(data);
  await rotationStore.rotationDevice(data);
  if (rotationStore.err && rotationStore.code == 400) {
    $toast.error(rotationStore.err, { position: "top-right" });
    return;
  } else if (rotationStore.err && rotationStore.code == 401) {
    $toast.warning(rotationStore.err, { position: "top-right" });
    return;
  } else {
    $toast.success(rotationStore.result.message, { position: "top-right" });
  }
  await usageStore.getUsageByIdRoom(route.params.id);
  rotationStore.closeRotationDevice();
};
watch(
  () => deparmentId.value,
  async (newval) => {
    if (newval) {
      data.newLocationId = "";
      console.log(deparmentId);
      await locationStore.getLocationsById(newval);
    }
  }
);
</script>
<template>
  <Form v-if="rotationStore.isShow.rotation" @submit="rotation">
    <fwb-modal @close="rotationStore.closeRotationDevice">
      <template #header>
        <div class="flex items-center text-lg">Luân chuyển thiết bị</div>
      </template>
      <template #body>
        <span class="font-semibold"
          >Bạn muốn luân chuyển các thiết bị vừa chọn từ phòng
          {{ props.currentRoomName }} sang:</span
        >
        <h3>Chọn khoa:</h3>
        <Field
          as="select"
          name="deparment"
          id="deparment"
          class="input-custom pl-2"
          v-model="deparmentId"
        >
          <option value="" class="">Trường-Khoa-Nhà học</option>
          <option
            v-if="locationStore.locations?.length"
            v-for="location in locationStore.locations"
            :key="location.id"
            :value="location.id"
          >
            {{ location.deparmentName }}
          </option>
        </Field>
        <div class="my-4">
          <h3>Chọn phòng:</h3>
          <div>
            <Field
              as="select"
              name="room"
              id="room"
              class="input-custom pl-2"
              v-model="data.newLocationId"
            >
              <option value="">Phòng</option>
              <option
                v-if="locationStore.rooms?.length"
                v-for="room in locationStore.rooms"
                :key="room.id"
                :value="room.id"
              >
                {{ room.roomName }}
              </option>
            </Field>
          </div>
        </div>
        <fwb-textarea
          v-model="data.reason"
          :rows="4"
          label="Lí do"
          class="pl-2"
          placeholder="Viết lí do.."
        />
      </template>
      <template #footer>
        <div class="flex justify-between">
          <fwb-button color="green">
            Luân chuyển <i class="fa-solid fa-arrow-right"></i>
          </fwb-button>
          <fwb-button @click="rotationStore.closeRotationDevice" color="red">
            Huỷ
          </fwb-button>
        </div>
      </template>
    </fwb-modal>
  </Form>
</template>
