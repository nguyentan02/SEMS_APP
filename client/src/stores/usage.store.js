import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import usageService from '@/services/usage.service'
import { useAuthStore } from './auth.store'
import { CustomError } from '@/untils/statuscode';

export const useUsageStore = defineStore('usage', ()=>{
    const authStore = useAuthStore()
    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const usages = ref(null)
    const usage = ref(null)
   const code =ref(null)
    const isShow = reactive({
        addUsage: false,
        editUsage:false
        
      });
    
    const showAddUsage = ()=>{
        isShow.addUsage= true
    }
    const closeAddUsage = ()=>{
        isShow.addUsage= false
    }
    const showEditUsage = ()=>{
        isShow.editUsage= true
    }
    const closeEditUsage = ()=>{
        isShow.editUsage= false
    }
   
    const getUsageByIdRoom = async (id) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await usageService.getUsageByIdRoom(authStore.token, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res.data
            usages.value = res.data
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }
    const getUsageById = async (id) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await usageService.getUsageById(authStore.token, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res.data
            usage.value = res.data
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }
    const createUsage = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        code.value =null
        try {
            let res = await usageService.createUsage(authStore.token, data)
            console.log(res);
            if (res.statusCode !== 200) throw new CustomError(res.statusCode,res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
            code.value =error.statusCode
        } finally {
            isLoading.value = false
        }
    }
    const updateUsage = async (id,data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await usageService.updateUsage(authStore.token,id,data)
            if (res.statusCode !== 200) throw new Error(res.message)
                result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }
    const deleteUsage = async (id) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await usageService.deleteUsage(authStore.token,id)
            if (res.statusCode !== 200) throw new Error(res.message)
                result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }
    return {err,result,isShow,code,isLoading,usages,getUsageById,usage,getUsageByIdRoom,createUsage,updateUsage,showAddUsage,showEditUsage,closeEditUsage,
        closeAddUsage,deleteUsage}
})