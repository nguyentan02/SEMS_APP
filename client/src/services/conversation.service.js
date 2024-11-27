import createService from './api.service'

class conversationService {
    constructor(baseUrl = '/api/conversation') {
        this.api = createService(baseUrl)
    }

    async accessConversation(token, data) {
        return (await this.api.post('/', data, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async fetchConversations(token) {  
        return (await this.api.get('/', {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new conversationService()