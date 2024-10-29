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
}

export default new categoryService()