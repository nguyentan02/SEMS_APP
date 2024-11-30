import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import dashboardService from '../services/dashboard.service'

export const useDashboardtore = defineStore('dashboard', () => {
    const authStore = useAuthStore()

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const statistical= reactive({
            user:0,
            device:0,
            conutType : [],
    })
    const chart = reactive({
           
            countCategory:[],
            departments:[],
            maintenances:[],
            countStatus:[]
    })
    const getStatistical = async (option) => {
        err.value = null
        isLoading.value = true
        try {
            let res = await dashboardService.getStatistical(authStore.token, option)
            if (res.statusCode !== 200) throw new Error(res.message)
            statistical.user = res.data.user
            statistical.device = res.data.device
            statistical.conutType = res.data.countType
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }
     const getChart = async (option) => {
        err.value = null
        isLoading.value = true
        try {
            let res = await dashboardService.getChart(authStore.token, option)
            if (res.statusCode !== 200) throw new Error(res.message)
      
            chart.countCategory = res.data.countCategory
            chart.departments = res.data.location
            chart.maintenances = res.data.maintenance
            chart.countStatus = res.data.countStatus
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }
    const downloadExcel = async () => {
        return await dashboardService.downloadExcelDevice(authStore.token)
    }

    return { err, result, isLoading, downloadExcel ,chart,statistical,getStatistical,getChart}
})