import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import notificationService from '../services/notification.service'

export const useNotificationStore = defineStore('notification', () => {
    const authStore = useAuthStore()

    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const notifications = ref([])
    const totalRead = ref(0)

    const getAllNotificationsByUserId = async () => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await notificationService.getAllNotificationsByUserId(authStore.token)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            notifications.value = result.value.data.notifications
            totalRead.value = result.value.data.totalUnread
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const readNotification = async (id) => {
        err.value = null
        result.value = null
        isLoading.value = true
        try {
            let res = await notificationService.readNotification(authStore.token, id)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return {
        err, result, isLoading, notifications, totalRead, getAllNotificationsByUserId, readNotification
    }
})