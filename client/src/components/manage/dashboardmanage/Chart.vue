<script setup>
import { useToast } from "vue-toast-notification";
import { useDashboardtore } from "../../../stores/dashboard.store";
import { onMounted, watch } from "vue";
import Bar from "./chart/Bar.vue";
import BarStatus from "./Chart/BarStatus.vue";
import Doughnut from "./chart/Doughnut.vue";
import Pie from "./Chart/Pie.vue";
const dashboardStore = useDashboardtore();
const $toast = useToast();

const props = defineProps(["option"]);

const getChart = async (option) => {
  await dashboardStore.getChart(option);
  if (dashboardStore.err) {
    $toast.error(dashboardStore.err, { position: "top-right" });
    return;
  }
};

watch(
  () => props.option,
  async (newval) => {
    await getChart(newval);
  }
);

onMounted(async () => {
  await getChart(props.option);
});
</script>

<template>
  <div class="flex flex-col gap-2 items-center">
    <div class="grid grid-cols-2 gap-2 w-full min-h-[450px]">
      <Doughnut :data="dashboardStore.chart.departments" />
      <Pie :data="dashboardStore.chart.countCategory" />
    </div>
    <div class="grid grid-cols-2 gap-2 w-full min-h-[450px]">
      <Bar :option="props.option" :data="dashboardStore.chart.maintenances" />
      <BarStatus
        :option="props.option"
        :data="dashboardStore.chart.countStatus"
      />
    </div>
  </div>
</template>
