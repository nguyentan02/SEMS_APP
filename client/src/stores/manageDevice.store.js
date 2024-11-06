import { reactive, ref } from "vue";
import { defineStore } from "pinia";


export const useManageDeviceStore = defineStore("manageDevice", () => {
  const isShow = reactive({
    addDevice: false,
    editDevice:false
    
  });
  const closeAddDeviceModal = () => {
    isShow.addDevice = false;
  };
  const showAddDeviceModal = () => {
    isShow.addDevice = true;
  };
 
  const closeEditDeviceModal = () => {
    isShow.editDevice = false;
  };
  const showEditDeviceModal = () => {
    isShow.editDevice = true;
  };
 
  return {
    isShow,
   closeAddDeviceModal,
   showAddDeviceModal,
   closeEditDeviceModal,
   showEditDeviceModal
  };
});
