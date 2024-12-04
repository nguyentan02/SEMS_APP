<template>
  <footer class="rounded-lg shadow border-2 bg-[#15803d]">
    <div class="w-full max-w-screen-xl mx-auto p-2">
      <div class="grid grid-cols-2 md:grid-cols-3">
        <a href="/home/device" class="flex items-center gap-2 p-2">
          <span class="text-[#f5ffff] text-2xl font-bold">Quản lý thiết bị</span>
        </a>
        <ul
          class="md:col-span-2 flex items-center text-xl md:text-3xl font-medium text-[#f5ffff] justify-end gap-5"
        >
          <li>
            <a target="_blank" href="https://www.facebook.com" class="hover:underline">
              <i class="fa-brands fa-facebook"></i>
            </a>
          </li>
          <li>
            <a target="_blank" href="https://www.youtube.com" class="hover:underline">
              <i class="fa-brands fa-youtube"></i>
            </a>
          </li>
          <li>
            <a target="_blank" href="https://www.linkedin.com" class="hover:underline">
              <i class="fa-brands fa-linkedin-in"></i>
            </a>
          </li>
        </ul>
      </div>
      <hr class="border-gray-200 mx-auto py-4" />
      <span class="text-[#f5ffff] flex flex-col text-center">
        <p class="md:text-lg font-semibold">
          © 2024 Hệ thống Quản lý Thiết bị
        </p>
        <div class="text-xs md:text-sm flex flex-col gap-1 items-center">
          <div>
            <i class="fa-solid fa-location-dot"></i>
            Khu 2, đường 3/2, Phường Xuân Khánh, Q. Ninh Kiều, TP. Cần Thơ, Việt Nam;
          </div>
          <div class="flex gap-2">
            <div>
              <i class="fa-solid fa-phone"></i>
              (84) 123-456-7890
            </div>
            <div>
              <i class="fa-solid fa-envelope"></i>
              help.ems.management@gmail.com
            </div>
          </div>
        </div>
      </span>
    </div>
  </footer>
</template>

<script setup>
import {
  FwbFooter,
  FwbFooterCopyright,
  FwbFooterLink,
  FwbFooterLinkGroup,
} from "flowbite-vue";
</script>
