import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import historyService from '@/services/history.service'
import { useAuthStore } from './auth.store'
export const useHistoryStore = defineStore('history', ()=>{
    const authStore = useAuthStore()
    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const maintenances = ref(null)
    const rotations = ref(null)
    const key =ref('')


    const getHistoryMaintenance = async(option)=>{
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await historyService.getHistoryMaintenance(authStore.token,option)
            if (res.statusCode !== 200) throw new Error(res.message)
                result.value = res.data
            maintenances.value = res.data
            
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }
 
    const getRotationHistory = async(option)=>{
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await historyService.getRotationHistory(authStore.token,option)
            if (res.statusCode !== 200) throw new Error(res.message)
                result.value = res.data
            rotations.value = res.data
            
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }
 

   
    return {err,result,isLoading,key,getHistoryMaintenance,maintenances,getRotationHistory,rotations}
})