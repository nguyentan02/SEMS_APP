import createService from './api.service'
import { createQueryString } from '@/untils'
class usageService {
    constructor(baseUrl = '/api/usage') {
        this.api = createService(baseUrl)
    }

    async getUsage(data) {
        let parameter = createQueryString(data)
        return (await this.api.get(`/${parameter}`)).data
    }
    async getUsageByIdRoom(token,id) {
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
        return (await this.api.post('cre-room',data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new usageService()