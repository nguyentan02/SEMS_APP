import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import userService from '../services/user.service'


export const useManageStore = defineStore('manage', ()=>{

    const isShow = reactive({
        addUser: false,
        editUser: false,
        feedback: false,
        editItem: false,
        addItem: false,
        editLocation: false,
        addLocation: false,
        editSchool: false,
        history: false,
    })
    const closeAddUserModal = () => { isShow.addUser = false }
    const showAddUserModal = () => { isShow.addUser = true }
    const closeFeedbackModal = () => { isShow.feedback = false }

    const showFeedbackModal = () => { isShow.feedback = true }
    const closeEdituserModal = () => { isShow.editUser = false }
    const showEdituserModal = () => { isShow.editUser = true }
    const closeHistoryModal = () => { isShow.history = false }

    const showHistoryModal = () => { isShow.history = true }
    return {
        isShow,closeFeedbackModal,showFeedbackModal,closeAddUserModal,showAddUserModal,showEdituserModal,closeEdituserModal,closeHistoryModal,showHistoryModal
    }
})