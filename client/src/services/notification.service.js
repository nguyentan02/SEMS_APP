import createService from './api.service'

class notificationService {
    constructor(baseUrl = '/api/notification') {
        this.api = createService(baseUrl)
    }

    async getAllNotificationsByUserId(token) {
        return (await this.api.get('/', {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }

    async readNotification(token, id) {
        return (await this.api.patch(`/${id}`, {}, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        })).data
    }
}

export default new notificationService()