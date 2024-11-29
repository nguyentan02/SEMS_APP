import createService from './api.service'
import { createQueryString } from '@/untils'
class categoryService {
    constructor(baseUrl = '/api/category') {
        this.api = createService(baseUrl)
    }

    async getCategory(data) {
        let parameter = createQueryString(data)
        return (await this.api.get(`/${parameter}`)).data
    }
    async getCategoryAll() {
        return (await this.api.get('byNot')).data
    }
    async createCategory(token,data) {
        return (await this.api.post('create-category',data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async getCategoryById(token,id) {
        return (await this.api.get(`/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async updateCategory(token,id,data) {
        console.log(id);
        return (await this.api.patch(`/update/${id}`,data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async deleteCategory(token,id) {
        console.log(id);
        return (await this.api.delete(`/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new categoryService()