import createService from './api.service'
import { createQueryString } from '@/untils'


class deviceService{
    constructor(baseUrl = '/api/device'){
        this.api = createService(baseUrl)
    }

    async getDevices(token,option) {
        const final = createQueryString(option)
        
        return (await this.api.get(`/${final}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async createService(token, data) {
        return (await this.api.postForm('/create', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async getDeviceById(token,id) {
        return (await this.api.get(`/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
   
}

export default new deviceService()