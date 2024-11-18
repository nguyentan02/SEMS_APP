import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import usageService from '@/services/usage.service'
import { useAuthStore } from './auth.store'
export const useUsageStore = defineStore('usage', ()=>{
    const authStore = useAuthStore()
    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const devices = ref(null)
    const usages = ref(null)
    const totalPages = ref(1)
    const currentPage = ref(1)
    const totalCount = ref(0)
    const key = ref('')
    const categoryId=ref('')
     const  groupByCategory = ref(false)
    const sortByDate = ref('asc')
    const isShow = reactive({
        qrModal:false
    })
    const showQrCodeModal = ()=>{
        isShow.qrModal= true
    }
    const closeQrCodeModal = ()=>{
        isShow.qrModal= false
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
 
    return {err,result,isLoading,usages,getUsageByIdRoom}
})