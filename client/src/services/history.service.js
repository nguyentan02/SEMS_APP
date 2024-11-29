import createService from './api.service'
import { createQueryString } from '@/untils'
class historyService {
    constructor(baseUrl = '/api/history') {
        this.api = createService(baseUrl)
    }

    async getHistoryMaintenance(token,option) {
        const final = createQueryString(option)
        
        return (await this.api.get(`/maintenance/${final}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async getRotationHistory(token,option) {
        const final = createQueryString(option)
        
        return (await this.api.get(`/rotation/${final}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new historyService()