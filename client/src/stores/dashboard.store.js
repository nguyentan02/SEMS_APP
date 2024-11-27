import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import dashboardService from '../services/dashboard.service'

export const useDashboardtore = defineStore('dashboard', () => {
    const authStore = useAuthStore()

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)

 

    const downloadExcel = async () => {
        return await dashboardService.downloadExcelDevice(authStore.token)
    }

    return { err, result, isLoading, downloadExcel }
})