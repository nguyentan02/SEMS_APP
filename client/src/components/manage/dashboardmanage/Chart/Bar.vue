<script setup>
import { Bar } from "vue-chartjs";
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
  elements,
} from "chart.js/auto";
import { computed, reactive, watch, onMounted, ref } from "vue";
import dayjs from "dayjs";
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

const props = defineProps(["option", "data"]);

const options = {
  responsive: true,
  aspectRatio: 2,
  plugins: {
    title: {
      text: "Biểu đồ thống kê tình trạng bảo trì",
      display: true,
    },
  },
};
const dataBar = reactive({
  labels: [],
  datasets: [
    {
      label: "Hoàn thành",
      backgroundColor: "rgba(0, 203, 32, 0.8)",
      data: [],
    },
    {
      label: "Đã huỷ",
      backgroundColor: "rgba(238, 9, 9, 0.8)",
      data: [],
    },
    {
      label: "Trễ hạn",
      backgroundColor: "rgba(236, 193, 21, 0.8)",
      data: [],
    },
    {
      label: "Đề nghị mới",
      backgroundColor: "rgba(175, 170, 150, 0.8)",
      data: [],
    },
  ],
});
const isLoading = ref(false);

const setDate = (option) => {
  dataBar.labels = [];
  switch (option.type) {
    case "month":
      dataBar.labels.push(`Tháng ${option.month}-${option.year}`);
      break;
    case "year":
      dataBar.labels.push(`Năm ${option.year}`);
      break;
    case "any":
      dataBar.labels.push(
        `Từ ngày ${dayjs(option.to).format("DD-MM-YYYY")} đến ${dayjs(
          option.from
        ).format("DD-MM-YYYY")}`
      );
      break;
  }
};

const setData = (data) => {
  dataBar.datasets[0].data = [];
  dataBar.datasets[1].data = [];
  dataBar.datasets[2].data = [];
  dataBar.datasets[3].data = [];
  data.forEach((element) => {
    if (element.maintenanceStatus === "COMPLETED") {
      dataBar.datasets[0].data.push(element._count);
    } else if (element.maintenanceStatus === "CANCEL") {
      dataBar.datasets[1].data.push(element._count);
    } else if (element.maintenanceStatus === "LATE") {
      dataBar.datasets[2].data.push(element._count);
    } else {
      dataBar.datasets[3].data.push(element._count);
    }
  });
};

watch(
  () => props.option,
  async (newval) => {
    setDate(newval);
  }
);

watch(
  () => props.data,
  (newval) => {
    isLoading.value = true;

    setData(newval);
    setTimeout(() => {
      isLoading.value = false;
    }, 500);
  }
);

onMounted(() => {
  setDate(props.option);
});

const chartData = computed(() => {
  return { ...dataBar };
});
</script>

<template>
  <div v-if="isLoading == false" class="p-1 bg-white rounded-lg shadow">
    <Bar :data="chartData" :options="options" />
  </div>
  <Loading v-else />
</template>
