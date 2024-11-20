import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import categoryService from '@/services/category.service'
import { CustomError } from '@/untils/statuscode';
export const useCategoryStore = defineStore('category', ()=>{
    const authStore = useAuthStore()
    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const categorys = ref(null)
    const totalPages = ref(1)
    const currentPage = ref(1)
    const totalCount = ref(0)
    const name = ref('')
    const code = ref(null)
const category =ref(null)
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
    const getCategoryById = async id => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            console.log(id);
            let res = await categoryService.getCategoryById(authStore.token, id)
            
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res.data.AttribyutesCategory
          category.value = result.value

        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }
    const createCategory = async (data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await categoryService.createCategory(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
          
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }
    const updateCategory = async (id,data) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            console.log(id);
            let res = await categoryService.updateCategory(authStore.token,id, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }
    const deleteCategory = async (id) => {
        err.value = null
        result.value = null
        isLoading.value = true
        code.value  = null
        try {
            console.log(id);
            let res = await categoryService.deleteCategory(authStore.token,id)
            if (res.statusCode !== 200) throw new CustomError(res.statusCode,res.message)
            result.value = res
            console.log(result.value);
        } catch (error) {
            err.value = error.message
            code.value= error.statusCode
            
        } finally {
            isLoading.value = false
        }
    }
    return {err,result,code,isLoading,name,category,categorys,totalCount,totalPages,currentPage,getCategory,getCategoryById,createCategory,updateCategory,deleteCategory}
})