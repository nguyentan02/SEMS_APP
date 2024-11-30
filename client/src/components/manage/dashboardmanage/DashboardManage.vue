<script setup>
import { onMounted, reactive, computed } from "vue";
import dayjs from "dayjs";
import Statistical from "./Statistical.vue";
import Chart from "./Chart.vue";
const emit = defineEmits(["currentPage"]);

const curentDate = dayjs();
const option = reactive({
  type: "month",
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  to: curentDate.subtract(1, "month").format("YYYY-MM-DD"),
  from: dayjs(new Date()).format("YYYY-MM-DD"),
});

onMounted(async () => {
  emit("currentPage", "dashboard");
});

const select = computed(() => {
  return { ...option };
});
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-2">Tổng quan</h1>
  </div>
  <div class="flex flex-col w-full max-h-[90vh] overflow-y-auto no-scrollbar">
    <div class="flex items-center gap-1 mb-2">
      <label for="type">Theo: </label>
      <select
        id="type"
        class="rounded p-2 text-sm font-medium cursor-pointer text-black"
        v-model="option.type"
      >
        <option value="month">Tháng</option>
        <option value="year">Năm</option>
        <option value="any">Tùy chọn</option>
      </select>
      <div class="flex gap-1 text-black">
        <div v-if="option.type !== 'any'" class="flex gap-1">
          <select
            v-if="option.type == 'month'"
            class="rounded px-6 py-1 text-sm font-medium cursor-pointer"
            v-model="option.month"
          >
            <option value="1">01</option>
            <option value="2">02</option>
            <option value="3">03</option>
            <option value="4">04</option>
            <option value="5">05</option>
            <option value="6">06</option>
            <option value="7">07</option>
            <option value="8">08</option>
            <option value="9">09</option>
            <option value="10">10</option>
            <option value="11">11</option>
            <option value="12">12</option>
          </select>
          <input
            type="number"
            class="rounded p-2 text-sm font-medium w-auto"
            v-model="option.year"
          />
        </div>
        <div v-else class="flex gap-1 items-center">
          <label for="to"> Từ ngày: </label>
          <input
            if="to"
            type="date"
            class="rounded p-2 text-sm font-medium cursor-pointer"
            v-model="option.to"
          />
          <label for="from"> đến ngày: </label>
          <input
            id="from"
            type="date"
            class="rounded p-2 text-sm font-medium cursor-pointer"
            v-model="option.from"
          />
        </div>
      </div>
    </div>
    <Statistical :option="select" />
    <Chart :option="select" />
    <!-- <ListStudent :option="select" /> -->
  </div>
</template>
