import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import locationService from '@/services/location.service'
import { useAuthStore } from './auth.store'
export const useLocationStore = defineStore('location', ()=>{
    const authStore = useAuthStore()
    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const locations = ref(null)
    const rooms = ref(null)
    const usages = ref(null)
    const totalPages = ref(1)
    const currentPage = ref(1)
    const totalCount = ref(0)
    const key = ref('')

    const getLocations = async(option)=>{
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await locationService.getLocation(option)
            if (res.statusCode !== 200) throw new Error(res.message)
                result.value = res
            locations.value = res.data.dataWithRoomCount
                totalPages.value = res.data.totalPages
                totalCount.value = res.data.totalCount
                if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }
 
    const getUsageInfo = async()=>{
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await locationService.getUsageInfo()
            if (res.statusCode !== 200) throw new Error(res.message) 
                result.value = res
              usages.value = res.data.dataWithRoomAndDeviceStatus
         
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }
    const getLocationsById= async(id)=>{
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await locationService.getLocationById(id)
            if (res.statusCode !== 200) throw new Error(res.message)
                result.value = res.data
              rooms.value = res.data
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }

    const createDepartment = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await locationService.createDepartment(authStore.token, data)
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
    const deleteRoom = async (id) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await locationService.deleteRoom(authStore.token, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }
    return {err,result,isLoading,key,locations,usages,totalCount,totalPages,currentPage,rooms,deleteRoom,getLocationsById,getLocations,getUsageInfo,createDepartment,updateDepartment,deleteDepartment}
})