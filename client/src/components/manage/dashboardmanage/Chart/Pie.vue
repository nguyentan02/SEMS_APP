<script setup>
import { Pie } from "vue-chartjs";
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
import { useCategoryStore } from "@/stores/category.store";
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

const categoryStore = useCategoryStore();

const options = {
  responsive: true,
  aspectRatio: 2,
  maintainAspectRatio: false,
  plugins: {
    title: {
      text: "Biểu đồ thống kê số lượng thiết theo danh mục",
      display: true,
    },
  },
};
const dataPie = reactive({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: [
        "rgba(255, 153, 0, 0.7)",
        "rgba(255, 51, 0, 0.7)",
        "rgba(255, 255, 0, 0.7)",
        "rgba(255, 0, 102, 0.7)",
        "rgba(255, 51, 204, 0.7)",
        "rgba(204, 255, 51, 0.7)",
        "rgba(204, 51, 0, 0.7)",
        "rgba(204, 0, 0, 0.7)",
        "rgba(102, 0, 51, 0.7)",
        "rgba(153, 0, 153, 0.7)",
      ],
      hoverOffset: 4,
    },
  ],
});
const isLoading = ref(false);

const setData = (data) => {
  dataPie.labels = [];
  dataPie.datasets[0].data = [];
  data.forEach((item) => {
    categoryStore.categoryAll.forEach((element) => {
      if (item.categoryId == element.id) {
        dataPie.labels.push(element.categoryName);
        dataPie.datasets[0].data.push(item._count);
      }
    });
  });
};

onMounted(async () => {
  await categoryStore.getCategoryAll();
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
  return { ...dataPie };
});
</script>

<template>
  <div v-if="isLoading == false" class="p-1 bg-white rounded-lg shadow">
    <Pie
      v-if="props.data.length"
      :data="chartIncomes"
      :options="options"
      class="w-full h-full"
    />
    <div v-else class="p-2 flex flex-col h-full">
      <div class="text-xs text-center font-bold text-gray-500">
        Biểu đồ thống kê số lượng thiết bị theo danh mục
      </div>
      <div class="flex-1 text-red-500 italic flex items-center justify-center">
        Không có dữ liệu...
      </div>
    </div>
  </div>
  <Loading v-else />
</template>
