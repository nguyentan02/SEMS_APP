import createService from './api.service'
import { createQueryString } from '@/untils'
class usageService {
    constructor(baseUrl = '/api/usage') {
        this.api = createService(baseUrl)
    }

  
    async getUsageByIdRoom(token,id) {
        return (await this.api.get(`/room/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async getUsageById(token,id) {

        return (await this.api.get(`/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async createUsage(token,data) {
        console.log(data);
        return (await this.api.post('create',data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async updateUsage(token,id,data) {  
        console.log(id);
        return (await this.api.patch(`/update/${id}`,data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async deleteUsage(token,id) {
        return (await this.api.delete(`/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new usageService()