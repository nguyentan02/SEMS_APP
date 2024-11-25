import createService from './api.service'
import { createQueryString } from '@/untils'
class maintenanceService {
    constructor(baseUrl = '/api/maintenance') {
        this.api = createService(baseUrl)
    }

    async getMaitenance(token,data) {
        let final = createQueryString(data)
        return (await this.api.get(`/${final}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async getMaitenanceByTech(token,data) {
        let final = createQueryString(data)
        return (await this.api.get(`/byTech/${final}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async getMaitenanceById(token,id) {
        return (await this.api.get(`/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async deleteMaintenance(token,id) {
        return (await this.api.delete(`/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async createMaitenance(token,data) {
        return (await this.api.post('/',data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async updateMaitenance(token,id,data) {
        return (await this.api.patch(`/${id}`,data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    
    async updateStatus(token,id,data) {
        return (await this.api.patch(`/status/${id}`,data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    
    async resMain(token,id,data) {
        return (await this.api.patch(`/res/${id}`,data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async sendMain(token,id,data) {
        return (await this.api.patch(`/send/${id}`,data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    
}

export default new maintenanceService()