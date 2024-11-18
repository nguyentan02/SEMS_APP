<template>
  <footer class="rounded-lg shadow border-2 bg-[#045D86]">
    <div class="w-full max-w-screen-xl mx-auto p-2">
      <div class="grid grid-cols-2 md:grid-cols-3">
        <a href="https://www.ctu.edu.vn/" class="flex items-center gap-2 p-2">
          <!-- <img src="/Asset_45logomobile.png" class="md:w-[80%]" alt="logo" /> -->
        </a>
        <ul
          class="md:col-span-2 flex items-center text-xl md:text-3xl font-medium text-[#f5ffff] justify-end gap-5"
        >
          <li>
            <a
              target="_blank"
              href="https://www.facebook.com/CTUDHCT/"
              class="hover:underline"
            >
              <i class="fa-brands fa-facebook"></i>
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.youtube.com/ctudhct"
              class="hover:underline"
            >
              <i class="fa-brands fa-youtube"></i>
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.instagram.com/ctudhct/"
              class="hover:underline"
            >
              <i class="fa-brands fa-instagram"></i>
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.linkedin.com/school/ctudhct/"
              class="hover:underline"
            >
              <i class="fa-brands fa-linkedin-in"></i>
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.tiktok.com/@ctudhct"
              class="hover:underline"
            >
              <i class="fa-brands fa-tiktok"></i>
            </a>
          </li>
        </ul>
      </div>
      <hr class="border-gray-200 mx-auto py-4" />
      <span class="text-[#f5ffff] flex flex-col text-center">
        <a
          target="_blank"
          href="https://yu.ctu.edu.vn/dtn.html"
          class="hover:underline md:text-lg font-semibold"
        >
          © 2024 ĐOÀN THANH NIÊN - HỘI SINH VIÊN TRƯỜNG ĐẠI HỌC CẦN THƠ
        </a>
        <div class="text-xs md:text-sm flex flex-col gap-1 items-center">
          <div>
            <i class="fa-solid fa-location-dot"></i>
            Khu II, đường 3/2, P. Xuân Khánh, Q. Ninh Kiều, TP. Cần Thơ.
          </div>
          <div class="flex gap-2">
            <div>
              <i class="fa-solid fa-phone"></i>
              (84-292) 3830309
            </div>
            <div>
              <i class="fa-solid fa-envelope"></i>
              vpdoan_hoi@ctu.edu.vn
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
