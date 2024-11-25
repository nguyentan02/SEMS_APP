import createService from './api.service'

class messageService {
    constructor(baseUrl = '/api/message') {
        this.api = createService(baseUrl)
    }

    async getAllMessages(token, conversationId) {
        return (await this.api.get(`/${conversationId}`, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async sendMessage(token, data) {
        return (await this.api.post('/send-message', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async sendImage(token, data) {
        return (await this.api.postForm('/send-image', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async readMessages(token, conversationId) {
        return (await this.api.patch(`/${conversationId}`, {}, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new messageService()