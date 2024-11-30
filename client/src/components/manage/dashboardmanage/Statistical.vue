<script setup>
import { useToast } from "vue-toast-notification";
import { useDashboardtore } from "../../../stores/dashboard.store";
import { onMounted, watch, ref } from "vue";

const dashboardStore = useDashboardtore();
const $toast = useToast();

const props = defineProps(["option"]);

const getStatistical = async (option) => {
  await dashboardStore.getStatistical(option);
  if (dashboardStore.err) {
    $toast.error(dashboardStore.err, { position: "top-right" });
    return;
  }
};

watch(
  () => props.option,
  async (newval) => {
    await getStatistical(newval);
  }
);
// const setData = () => {
//   dashboardStore.statistical?.conutType.map((item) => {
//     console.log(item);
//     if (item.expired == false) {
//       noexpried.value = item._count;
//     } else {
//       expried.value = item._count;
//     }
//     console.log(noexpried.value, expried.value);
//   });
// };

onMounted(async () => {
  await getStatistical(props.option);
});
const expried = ref(null);
const noexpried = ref(null);
</script>

<template>
  <div class="grid grid-cols-4 gap-2 mb-5">
    <div class="flex flex-col gap-2 p-4 rounded-md shadow text-lg border-2">
      <i class="fa-regular fa-user text-2xl text-red-500"></i>
      <span class="font-medium">
        {{ dashboardStore.statistical?.user }}
      </span>
      <span class="">Thành viên</span>
    </div>
    <div class="flex flex-col gap-2 p-4 rounded-md shadow text-lg border-2">
      <i class="fa-regular fa-hard-drive text-2xl text-red-500"></i>
      <span class="font-medium">
        {{ dashboardStore.statistical?.device }}
      </span>
      <span class="">Thiết bị</span>
    </div>

    <!-- <div class="flex flex-col">
        <span>{{ noexpried }} còn hạn </span>
        <span v-if="expried != null">{{ expried }} hết hạn </span>
      </div> -->
  </div>
</template>
