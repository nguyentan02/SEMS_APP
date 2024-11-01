import { reactive, ref } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth.store";
import userService from "../services/user.service";

export const useManageStore = defineStore("manage", () => {
  const isShow = reactive({
    addUser: false,
    editUser: false,
    feedback: false,
    editCategory: false,
    addCategory: false,
    editLocation: false,
    detailModal: false,
    addLocation: false,
    editSchool: false,
    history: false,
  });
  const closeAddUserModal = () => {
    isShow.addUser = false;
  };
  const showAddUserModal = () => {
    isShow.addUser = true;
  };
  const closeFeedbackModal = () => {
    isShow.feedback = false;
  };

  const showFeedbackModal = () => {
    isShow.feedback = true;
  };
  const closeEdituserModal = () => {
    isShow.editUser = false;
  };
  const showEdituserModal = () => {
    isShow.editUser = true;
  };
  const closeHistoryModal = () => {
    isShow.history = false;
  };
  const showHistoryModal = () => {
    isShow.history = true;
  };
  const showDetailModal = () => {
    isShow.detailModal = true;
  };
  const closeDetailModal = () => {
    isShow.detailModal = false;
  };
  const showAddLocationModal = () => {
    isShow.addLocation = true;
  };
  const closeAddLocationModal = () => {
    isShow.addLocation = false;
  };
  const showEditLocationModal = () => {
    isShow.editLocation = true;
  };
  const closeEditLocationModal = () => {
    isShow.editLocation = false;
  };
  const showAddCategoryModal = () => {
    isShow.addCategory = true;
  };
  const closeAddCategoryModal = () => {
    isShow.addCategory = false;
  };
  const showEditCategoryModal = () => {
    isShow.editCategory = true;
  };
  const closeEditCategoryModal = () => {
    isShow.editCategory = false;
  };
  return {
    isShow,
    closeFeedbackModal,
    showFeedbackModal,
    closeAddUserModal,
    showAddUserModal,
    showEdituserModal,
    closeEdituserModal,
    closeHistoryModal,
    showHistoryModal,
    showDetailModal,
    closeDetailModal,
    showAddLocationModal,
    closeAddLocationModal,
    showEditLocationModal,
    closeEditLocationModal,
    showAddCategoryModal,
    closeAddCategoryModal,
    showEditCategoryModal,
    closeEditCategoryModal
  };
});
