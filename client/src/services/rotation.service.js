import createService from './api.service'
import { createQueryString } from '@/untils'
class rotationService {
    constructor(baseUrl = '/api/rotation') {
        this.api = createService(baseUrl)
    }

    async rotationDevice(token,data) {
        return (await this.api.post('/',data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new rotationService()