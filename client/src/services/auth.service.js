import createService from './api.service'

class authService {
    constructor(baseUrl = '/api/auth') {
        this.api = createService(baseUrl)
    }

    async login(data) {
        return (await this.api.post('/login', data)).data
    }
    async register(token,data) {
        return (await this.api.post(`/register`,data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new authService()