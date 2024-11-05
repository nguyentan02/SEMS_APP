import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import deviceService from '@/services/device.service'
import { useAuthStore } from './auth.store'
export const useDeviceStore = defineStore('device', ()=>{
    const authStore = useAuthStore()
    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const devices = ref(null)
    const totalPages = ref(1)
    const currentPage = ref(1)
    const totalCount = ref(0)
    const name = ref('')
    const isShow = reactive({
        qrModal:false
    })
    const showQrCodeModal = ()=>{
        isShow.qrModal= true
    }
    const closeQrCodeModal = ()=>{
        isShow.qrModal= false
    }
    const getDevices = async(option)=>{
        const authStore = useAuthStore()
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await deviceService.getDevices(authStore.token,option)
            if (res.statusCode !== 200) throw new Error(res.message)
                result.value = res
               devices.value = res.data.data
                totalPages.value = res.data.totalPages
                totalCount.value = res.data.totalCount
                if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
        } catch (error) {
                err.value = error.message
        }finally{
             isLoading.value= false
        }
    }
    const createDevice = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await deviceService.createService(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            console.log(result.value);
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }
    // const createRoom = async (data) => {
    //     err.value = null
    //     result.value = null
    //     isLoading.value = true
    //     try {
    //         let res = await locationService.createRoom(authStore.token, data)
    //         if (res.statusCode !== 200) throw new Error(res.message)
    //         result.value = res
    //     } catch (error) {
    //         err.value = error.message
    //     } finally {
    //         isLoading.value = false
    //     }
    // }
    const updateDepartment = async (data,id) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await locationService.updateDepartment(authStore.token, id,data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }
    const deleteDepartment = async (id) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await locationService.deleteDepartment(authStore.token, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }
    return {err,result,isLoading,name,devices,totalCount,totalPages,currentPage,getDevices,showQrCodeModal,closeQrCodeModal,isShow,createDevice}
})