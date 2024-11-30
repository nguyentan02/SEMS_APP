<script setup>
import { Doughnut } from "vue-chartjs";
import {
  Chart as ChartJs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useLocationStore } from "../../../../stores/location.store";
import Loading from "@/components/common/Loading.vue";

ChartJs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const props = defineProps(["data"]);

const locationStore = useLocationStore();

const options = {
  responsive: true,
  aspectRatio: 2,
  maintainAspectRatio: false,
  plugins: {
    title: {
      text: "Biểu đồ thống kê số lượng thiết bị theo vị trí",
      display: true,
    },
  },
};
const dataDoughnut = reactive({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [
        "RGBA( 250, 235, 215, 1 )",
        "RGBA( 0, 255, 255, 1 )",
        "RGBA( 127, 255, 212, 1 )",
        "RGBA( 240, 255, 255, 1 )",
        "RGBA( 245, 245, 220, 1 )",
        "RGBA( 0, 0, 0, 1 )",
        "RGBA( 0, 0, 255, 1 )",
        "RGBA( 138, 43, 226, 1 )",
        "RGBA( 165, 42, 42, 1 )",
        "RGBA( 222, 184, 135, 1 )",
        "RGBA( 95, 158, 160, 1 )",
        "RGBA( 127, 255, 0, 1 )",
        "RGBA( 210, 105, 30, 1 )",
        "RGBA( 255, 127, 80, 1 )",
        "RGBA( 100, 149, 237, 1 )",
        "RGBA( 255, 248, 220, 1 )",
        "RGBA( 220, 20, 60, 1 )",
        "RGBA( 0, 255, 255, 1 )",
        "RGBA( 0, 0, 139, 1 )",
        "RGBA( 0, 139, 139, 1 )",
        "RGBA( 184, 134, 11, 1 )",
        "RGBA( 169, 169, 169, 1 )",
        "RGBA( 0, 100, 0, 1 )",
        "RGBA( 169, 169, 169, 1 )",
        "RGBA( 189, 183, 107, 1 )",
        "RGBA( 139, 0, 139, 1 )",
        "RGBA( 85, 107, 47, 1 )",
        "RGBA( 255, 140, 0, 1 )",
        "RGBA( 153, 50, 204, 1 )",
        "RGBA( 139, 0, 0, 1 )",
        "RGBA( 233, 150, 122, 1 )",
        "RGBA( 143, 188, 143, 1 )",
        "RGBA( 72, 61, 139, 1 )",
        "RGBA( 47, 79, 79, 1 )",
        "RGBA( 0, 206, 209, 1 )",
        "RGBA( 148, 0, 211, 1 )",
        "RGBA( 255, 20, 147, 1 )",
        "RGBA( 0, 191, 255, 1 )",
        "RGBA( 105, 105, 105, 1 )",
        "RGBA( 30, 144, 255, 1 )",
        "RGBA( 178, 34, 34, 1 )",
        "RGBA( 255, 250, 240, 1 )",
        "RGBA( 34, 139, 34, 1 )",
        "RGBA( 255, 0, 255, 1 )",
        "RGBA( 220, 220, 220, 1 )",
        "RGBA( 255, 215, 0, 1 )",
        "RGBA( 128, 128, 128, 1 )",
        "RGBA( 0, 128, 0, 1 )",
        "RGBA( 173, 255, 47, 1 )",
      ],
      hoverOffset: 4,
    },
  ],
});
const isLoading = ref(false);

const setData = (data) => {
  dataDoughnut.labels = [];
  dataDoughnut.datasets[0].data = [];
  data.forEach((item) => {
    locationStore.locations.forEach((element) => {
      if (item.id == element.id) {
        dataDoughnut.labels.push(element.deparmentName);
        dataDoughnut.datasets[0].data.push(item.totalDevices);
      }
    });
  });
};

onMounted(async () => {
  await locationStore.getLocations({});
});

watch(
  () => props.data,
  (newVal) => {
    isLoading.value = true;
    setData(newVal);
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  }
);

const chartIncomes = computed(() => {
  return { ...dataDoughnut };
});
</script>

<template>
  <div v-if="isLoading == false" class="p-1 bg-white rounded-lg shadow">
    <Doughnut
      v-if="props.data.length"
      :data="chartIncomes"
      :options="options"
      class="w-full h-full"
    />
    <div v-else class="p-2 flex flex-col h-full">
      <div class="text-xs text-center font-bold text-gray-500">
        Biểu đồ thống kê số lượt bài viết theo vị trí
      </div>
      <div class="flex-1 text-red-500 italic flex items-center justify-center">
        Không có dữ liệu...
      </div>
    </div>
  </div>
  <Loading v-else />
</template>
