import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import categoryService from '@/services/category.service'
export const useCategoryStore = defineStore('category', ()=>{
    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const categorys = ref(null)
    const totalPages = ref(1)
    const currentPage = ref(1)
    const totalCount = ref(0)
    const name = ref('')

    const getCategory = async(option)=>{
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await categoryService.getCategory(option)
            if (res.statusCode !== 200) throw new Error(res.message)
                result.value = res
                categorys.value = res.data.data
                totalPages.value = res.data.totalPages
                totalCount.value = res.data.totalCount
                if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
        } catch (error) {
                err.value = error.message
        }finally{
            isLoading.value= false
        }
    }
    return {err,result,isLoading,name,categorys,totalCount,totalPages,currentPage,getCategory}
})