import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import maintenanceService from '@/services/maintenance.service'
import { useAuthStore } from './auth.store'
import io from "socket.io-client";

const ENDPOINT = import.meta.env.VITE_URL_API

export const useMaintenanceStore = defineStore('maintenance', ()=>{
    const socket = io(ENDPOINT)
    const authStore = useAuthStore()
    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const maintenances = ref(null)
    const maintenance = ref(null)
    const status = ref(false)
    const key = ref('')
    const groupByUser = ref(false)
    const isShow = reactive({
        detailMaintenance:false
    })
    const showDetail  =()=>{
        isShow.detailMaintenance = true
    }
    const closeDetail  =()=>{
        isShow.detailMaintenance = false
    }
    const getMaitenances = async(option)=>{
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await maintenanceService.getMaitenance(authStore.token,option)
            if (res.statusCode !== 200) throw new Error(res.message)  
            maintenances.value = res.data
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }
    const getMaitenancesByTech = async(option)=>{
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await maintenanceService.getMaitenanceByTech(authStore.token,option)
            if (res.statusCode !== 200) throw new Error(res.message)  
            maintenances.value = res.data
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }
    const getMaitenanceById= async(id)=>{
        err.value = null
        result.value = null
        isLoading.value = true

        try {
            let res = await maintenanceService.getMaitenanceById(authStore.token,id)
            if (res.statusCode !== 200) throw new Error(res.message)
         
            result.value = res.data
            maintenance.value = res.data
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }
    const createMaitenance = async(data)=>{
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await maintenanceService.createMaitenance(authStore.token,data)
            console.log(res);
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }
    const updateMaitenance = async(id,data)=>{
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await maintenanceService.updateMaitenance(authStore.token,id,data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            socket.emit('new notification', {userId: res.data  })
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }
    const updateStatus = async(id,data)=>{
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await maintenanceService.updateStatus(authStore.token,id,data)
            console.log(res);
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            socket.emit('new notification', {userId: res.data  })   
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }
 
    const deleteMaintenance = async(id)=>{
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await maintenanceService.deleteMaintenance(authStore.token,id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            socket.emit('new notification', {userId: res.data  })
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }
    const resMaintenance = async(id)=>{
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await maintenanceService.resMain(authStore.token,id)
            console.log(res);
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }
    
    const sendMaintenance = async(id)=>{
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await maintenanceService.sendMain(authStore.token,id)
            console.log(res);
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        // console.log(socket);
        
            socket.emit('new notification', {userId: res.data  })
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }
    
    return {err,result,isLoading,status,key,maintenance,groupByUser,isShow,getMaitenances,sendMaintenance,maintenances,createMaitenance,updateStatus,resMaintenance,getMaitenancesByTech,getMaitenanceById,updateMaitenance,deleteMaintenance,closeDetail,showDetail}
})