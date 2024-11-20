import createService from './api.service'
import { createQueryString } from '@/untils'
class locationService {
    constructor(baseUrl = '/api/location') {
        this.api = createService(baseUrl)
    }

    async getLocation(data) {
        let parameter = createQueryString(data)
        return (await this.api.get(`/${parameter}`)).data
    }
    async getUsageInfo(data) {
        let parameter = createQueryString(data)
        return (await this.api.get(`/usage/${parameter}`)).data
    }
    async getLocationById(id) {
        return (await this.api.get(`/${id}`)).data
    }
    async createDepartment(token,data) {
        return (await this.api.post('cre-department',data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async updateDepartment(token,id,data) {
        return (await this.api.patch(`up-department/${id}`,data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    async deleteDepartment(token,id) {
        return (await this.api.delete(`/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
    // async createRoom(token,data) {
    //     console.log(data);
    //     return (await this.api.post('cre-room',data, {
    //         headers: {
    //             "Content-Type": "application/json",
    //             Accept: "application/json",
    //             Authorization: `Bearer ${token}`
    //         }
    //     })).data
    // }
}

export default new locationService()