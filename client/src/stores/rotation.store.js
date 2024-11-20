import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import rotationService from '@/services/rotation.service';
import { useAuthStore } from './auth.store'
import { CustomError } from '@/untils/statuscode';

export const useRotationDevice = defineStore('rotation', ()=>{
    const authStore = useAuthStore()
    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const code =ref(null)
     const isShow = reactive({
        rotation: false
      });
    
    const showRotationDevice = ()=>{
        isShow.rotation= true
    }
    const closeRotationDevice = ()=>{
        isShow.rotation= false
    }

    const rotationDevice = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        code.value =null
        try {
            let res = await rotationService.rotationDevice(authStore.token, data)
            if (res.statusCode !== 200) throw new CustomError(res.statusCode,res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
            code.value =error.statusCode
        } finally {
            isLoading.value = false
        }
    }
    return {err,result,isShow,isLoading,code,rotationDevice,showRotationDevice,closeRotationDevice}
})