<script setup>
import VueCal from "vue-cal";
import { onMounted, ref } from "vue";
import "vue-cal/dist/vuecal.css";
import dayjs from "dayjs";
import { useMaintenanceStore } from "@/stores/maintenance.store";
import { FwbButton, FwbModal, FwbTextarea } from "flowbite-vue";
import { Field } from "vee-validate";
const isShowModal = ref(false);
const selectedStatus = ref("");
import Tag from "primevue/tag";
import Loading from "@/components/common/Loading.vue";

function closeModal() {
  isShowModal.value = false;
}
const selectedEvent = ref(null);
function showModal(event) {
  selectedEvent.value = event; // Lưu sự kiện vào biến selectedEvent
  isShowModal.value = true;
}
const maintenanceStore = useMaintenanceStore();
const events = ref([]);
onMounted(async () => {
  await maintenanceStore.getMaitenancesByTech({});

  console.log(maintenanceStore.maintenances);
  const formattedEvents = maintenanceStore.maintenances.map((maintenance) => {
    return {
      title: maintenance.title,
      start: dayjs(maintenance.startDate).format("YYYY-MM-DD HH:mm"),
      end: dayjs(maintenance.endDate).format("YYYY-MM-DD HH:mm"),
      id: maintenance.id,
      description: maintenance.descriptionPlan,
      cost: maintenance.cost,
      room: maintenance.Room.roomName,
      department: maintenance.Room.deparment.deparmentName,
      status: maintenance.priority,
      name: maintenance.Device.name,
      serialNumber: maintenance.Device.serialNumber,
      class: maintenance.maintenanceStatus,
    };
  });

  // Cập nhật mảng sự kiện
  events.value = formattedEvents;
  console.log(events.value);
});
const getSeverity = (status) => {
  switch (status) {
    case "CANCEL":
      return "danger";

    case "PENDING":
      return "secondary";

    case "APPROVED":
      return "info";

    case "COMPLETED":
      return "success";
    case "LATE":
      return "warning";
  }
};
const getValue = (status) => {
  switch (status) {
    case "CANCEL":
      return "Đã huỷ";

    case "PENDING":
      return "Đề nghị mới";

    case "APPROVED":
      return "Đang thực hiện";

    case "COMPLETED":
      return "Hoàn thành";
    case "LATE":
      return "Trễ hạn";
  }
};
const getPriority = (newValue) => {
  if (newValue === "LOW") {
    return "Thấp";
  } else if (newValue === "MEDIUM") {
    return "Thường";
  } else if (newValue === "HIGH") {
    return "Cao";
  }
};
const today = ref(new Date().toISOString().split('T')[0]);
</script>
<style>
.vuecal__event {
  cursor: pointer;
}
.vuecal__menu,
.vuecal__cell-events-count {
  background-color: #42b983;
}

.vuecal__event-time {
  display: inline-block;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.vuecal__event.APPROVED {
  background-color: rgba(14, 29, 230, 0.9);
  border: 1px solid rgb(63, 139, 238);
  color: #fff;
}
.vuecal__event.LATE {
  background-color: rgba(235, 56, 56, 0.9);
  border: 1px solid rgb(235, 82, 82);
  color: #fff;
}
.vuecal__event.COMPLETED {
  background-color: rgba(7, 150, 14, 0.9);
  border: 1px solid rgb(69, 216, 40);
  color: #fff;
}
</style>
<template>
  <div class="mt-5">
    <div>
      <h1 class="text-2xl font-bold mb-10 text-[#25861e]">
        <i class="fa-regular fa-calendar mr-2"></i>Lịch bảo trì
      </h1>
    </div>
    <vue-cal
      locale="vi"
      :selected-date="today"
      :time-from="6 * 60"
      :time-to="23 * 60"
      :disable-views="['years']"
      :events="events"
      :on-event-click="showModal"
      style="height: 700px"
    />
  </div>

  <fwb-modal v-if="isShowModal" @close="closeModal">
    <template #header>
      <div class="flex items-center text-lg">
        <div class="mr-1">
          <i class="fa-solid fa-circle-info mr-1"></i>Chi tiết bảo trì:
        </div>
        <div class="">
          {{ selectedEvent.start && selectedEvent.start.format("DD/MM/YYYY") }}
        </div>
      </div>
    </template>
    <template #body>
      <div v-if="selectedEvent">
        <p class="mb-2"><strong>ID:</strong> {{ selectedEvent.id }}</p>
        <p class="mb-2"><strong>Tiêu đề:</strong> {{ selectedEvent.title }}</p>
        <p class="mb-2">
          <strong>Thiết bị:</strong> {{ selectedEvent.name }} ({{
            selectedEvent.serialNumber
          }})
        </p>
        <p class="mb-2">
          <strong>Địa chỉ:</strong> {{ selectedEvent.room }} ({{
            selectedEvent.department
          }})
        </p>
        <p class="mb-2">
          <strong>Thời gian:</strong>
          {{ selectedEvent.start.format("DD/MM/YYYY") }} đến
          {{ selectedEvent.end.format("DD/MM/YYYY") }}
        </p>

        <p class="mb-2">
          <strong>Tiến độ:</strong>
          <Tag
            class="w-[120px] p-1 ml-1"
            :value="getValue(selectedEvent.class)"
            :severity="getSeverity(selectedEvent.class)"
          />
        </p>

        <p class="mb-2">
          <strong>Mức độ ưu tiên:</strong>
          {{ getPriority(selectedEvent.status) }}
        </p>
        <fwb-textarea
          v-model="selectedEvent.description"
          readonly
          :rows="4"
          label="Ghi chú"
          placeholder="/"
        />
      </div>
    </template>
  </fwb-modal>
</template>
