import { reactive, ref } from "vue";
import { defineStore } from "pinia";


export const useManageDeviceStore = defineStore("manageDevice", () => {
  const isShow = reactive({
    addDevice: false,
    
  });
  const closeAddDeviceModal = () => {
    isShow.addDevice = false;
  };
  const showAddDeviceModal = () => {
    isShow.addDevice = true;
  };
 
  return {
    isShow,
   closeAddDeviceModal,
   showAddDeviceModal
  
  };
});
