<script setup>
import { onMounted, ref } from "vue";
import { useUsageStore } from "@/stores/usage.store";
import { useRoute } from "vue-router";
import DataTable from "primevue/datatable";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import Dialog from "primevue/dialog";
import Tag from "primevue/tag";
import Column from "primevue/column";
import Button from "primevue/button";
import dayjs from "dayjs";
import Loading from "@/components/common/Loading.vue";
import SpeedDial from "primevue/speeddial";
import Toolbar from "primevue/toolbar";
const usageStore = useUsageStore();

const route = useRoute();
const roomId = route.params.id;
let interval = ref(null);
const elapsedTime = (startTime) => {
  const now = dayjs();
  const start = dayjs(startTime);
  const duration = now.diff(start, "second");

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  return `${hours}h:${minutes}m:${seconds}s`;
};
onMounted(async () => {
  await usageStore.getUsageByIdRoom(roomId);
});

const getSeverity = (status) => {
  switch (status) {
    case "unqualified":
      return "danger";

    case "":
      return "success";

    case "ĐANG HOẠT ĐỘNG":
      return "success";

    case "negotiation":
      return "warning";

    case "renewal":
      return null;
  }
};
const products = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const openNew = () => {
  product.value = {};
  submitted.value = false;
  productDialog.value = true;
};
</script>
<template>
  <div>
    <h1 class="text-2xl font-bold mb-10 text-[#25861e]">
      Danh sách thiết của phòng {{}}
    </h1>
  </div>
  <Toolbar class="mb-4 px-2 py-3 rounded-md">
    <template #start>
      <Button
        label="New"
        icon="pi pi-plus"
        class="mr-2 p-2 bg-[#25861e] text-white"
        @click="openNew"
      />
    </template>

    <template #end>
      <Button label="Export" icon="pi pi-upload" severity="help" />
    </template>
  </Toolbar>
  <div v-if="!usageStore.isLoading" class="card background-manage">
    <DataTable
      :value="usageStore.usages"
      paginator
      :rows="10"
      dataKey="id"
      filterDisplay="menu"
    >
      <!-- <template #header>
        <div class="flex justify-content-between border-b border-gray-500">
          <Button
            type="button"
            icon="pi pi-filter-slash"
            label="Clear"
            outlined
          />
        </div>
      </template> -->
      <template #empty> No customers found. </template>
      <div class="">
        <Column
          header="Name"
          field="Device.name"
          sortable
          style="min-width: 6rem"
          class="p-2 border-b border-gray-400"
          frozen
        >
        </Column>
        <Column
          header="Serial"
          field="Device.serialNumber"
          style="min-width: 6rem"
          class="p-2 border-b border-gray-400"
          frozen
        >
        </Column>
        <Column
          header="Loại"
          field="Device.category.categoryName"
          style="min-width: 8rem"
          class="p-2 border-b border-gray-400"
          frozen
        >
        </Column>
        <Column
          header="Hình ảnh"
          style="min-width: 8rem"
          class="border-b border-gray-400"
        >
          <template #body="{ data }">
            <div class="flex align-items-center gap-2">
              <img alt="flag" :src="data.Device.image" style="width: 50px" />
            </div>
          </template>
        </Column>
        <Column
          header="Ngày bắt đầu"
          sortable
          field="usage_end"
          style="min-width: 12rem"
          class="border-b border-gray-400"
          filter-field=""
        >
          <template #body="{ data }">
            {{ dayjs(data.usage_start).format("DD/MM/YYYY HH:mm:ss") }}
          </template>
        </Column>
        <Column
          header="Ngày hết hạn"
          field="usage_end"
          sortable
          style="min-width: 12rem"
          class="border-b border-gray-400"
        >
          <template #body="{ data }">
            {{ dayjs(data.usage_end).format("DD/MM/YYYY HH:mm:ss") }}
          </template>
        </Column>
        <!-- <Column
          header="Thời gian đã sử dụng"
          style="min-width: 10rem"
          class="border-b border-gray-400"
        >
          <template #body="{ data }">
            {{ elapsedTime(data.usage_start) }}
          </template>
        </Column> -->
        <Column
          header="Ghi chú"
          style="min-width: 10rem"
          class="border-b border-gray-400"
        >
          <template #body="{ data }">
            <p>{{ data.purpose }}</p>
          </template>
        </Column>

        <Column
          header="Trạng thái"
          sortable
          style="min-width: 5rem"
          class="border-b border-gray-400"
        >
          <template #body="{ data }">
            <Tag
              class="p-1"
              :value="data.Device.statusDevice"
              :severity="getSeverity(data.Device.statusDevice)"
            />
          </template>
        </Column>

        <Column
          :exportable="false"
          style="min-width: 2rem"
          class="border-b border-gray-400"
        >
          <template #body="slotProps">
            <div class="flex">
              <Button
                icon="pi pi-pencil"
                outlined
                rounded
                class="text-emerald-600 border border-emerald-600 size-9 mr-1"
              />
              <Button
                icon="pi pi-trash"
                outlined
                rounded
                class="text-red-600 border border-red-600 size-9"
              />
            </div>
          </template>
        </Column>
      </div>
    </DataTable>
    <Dialog
      v-model:visible="productDialog"
      :style="{ width: '450px' }"
      header="Product Details"
      :modal="true"
      class="p-fluid"
    >
      <img
        v-if="product.image"
        :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`"
        :alt="product.image"
        class="block m-auto pb-3"
      />
      <div class="field">
        <label for="name">Name</label>
        <InputText
          id="name"
          v-model.trim="product.name"
          required="true"
          autofocus
          :invalid="submitted && !product.name"
        />
        <small class="p-error" v-if="submitted && !product.name"
          >Name is required.</small
        >
      </div>
      <div class="field">
        <label for="description">Description</label>
        <Textarea
          id="description"
          v-model="product.description"
          required="true"
          rows="3"
          cols="20"
        />
      </div>

      <div class="field">
        <label for="inventoryStatus" class="mb-3">Inventory Status</label>
        <Dropdown
          id="inventoryStatus"
          v-model="product.inventoryStatus"
          :options="statuses"
          optionLabel="label"
          placeholder="Select a Status"
        >
          <template #value="slotProps">
            <div v-if="slotProps.value && slotProps.value.value">
              <Tag
                :value="slotProps.value.value"
                :severity="getStatusLabel(slotProps.value.label)"
              />
            </div>
            <div v-else-if="slotProps.value && !slotProps.value.value">
              <Tag
                :value="slotProps.value"
                :severity="getStatusLabel(slotProps.value)"
              />
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
        </Dropdown>
      </div>

      <div class="field">
        <label class="mb-3">Category</label>
        <div class="formgrid grid">
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category1"
              name="category"
              value="Accessories"
              v-model="product.category"
            />
            <label for="category1">Accessories</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category2"
              name="category"
              value="Clothing"
              v-model="product.category"
            />
            <label for="category2">Clothing</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category3"
              name="category"
              value="Electronics"
              v-model="product.category"
            />
            <label for="category3">Electronics</label>
          </div>
          <div class="field-radiobutton col-6">
            <RadioButton
              id="category4"
              name="category"
              value="Fitness"
              v-model="product.category"
            />
            <label for="category4">Fitness</label>
          </div>
        </div>
      </div>

      <div class="formgrid grid">
        <div class="field col">
          <label for="price">Price</label>
          <InputNumber
            id="price"
            v-model="product.price"
            mode="currency"
            currency="USD"
            locale="en-US"
          />
        </div>
        <div class="field col">
          <label for="quantity">Quantity</label>
          <InputNumber id="quantity" v-model="product.quantity" integeronly />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Save" icon="pi pi-check" text @click="saveProduct" />
      </template>
    </Dialog>
  </div>
  <div v-else class="absolute right-[47%]">
    <Loading />
  </div>
</template>
