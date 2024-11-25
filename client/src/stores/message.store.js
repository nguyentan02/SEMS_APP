import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './auth.store'
import { useUserStore } from './user.store'
import { useConversationStore } from './conversation.store'
import { useNotificationStore } from './notification.store'
import { getSender } from '../untils/'
import messageService from '../services/message.service'
import io from "socket.io-client";
import { useMaintenanceStore } from './maintenance.store'
const ENDPOINT = import.meta.env.VITE_URL_API
console.log(ENDPOINT);
export const useMessageStore = defineStore('message', () => {
    const authStore = useAuthStore()
    const userStore = useUserStore()
    const maintenanceStore =useMaintenanceStore()
    const conversationStore = useConversationStore()
    const notificationStore = useNotificationStore()
    const activeIndex = ref(null)
    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const messages = ref([])
    const newMessage = ref(null)

    const socket = io('http://localhost:8000/')

    

    const setupSocket = () => {
        socket.emit('setup', { userId: userStore.user.id })
        // socket.on('notification recieved', async () => {
        //     await notificationStore.getAllNotificationsByUserId()
        // })
        socket.on('message recieved', async newMessageRecieved => {
            await conversationStore.fetchConversations()
            if (conversationStore.activeIndex !== null) {
                if (conversationStore.conversations[conversationStore.activeIndex].id == newMessageRecieved.conversationId) {
                    messages.value.push(newMessageRecieved)
                }
            }
        })
        socket.on('notification recieved', async newMessageRecieved => {
            await notificationStore.getAllNotificationsByUserId()
            await maintenanceStore.getMaitenancesByTech({})
            // if (conversationStore.activeIndex !== null) {
            //     if (conversationStore.conversations[conversationStore.activeIndex].id == newMessageRecieved.conversationId) {
            //         messages.value.push(newMessageRecieved)
            //     }
            // }
        })
        socket.on('image recieved', async newImageRecieved => {
            await conversationStore.fetchConversations()
            if (conversationStore.activeIndex !== null) {
                if (conversationStore.conversations[conversationStore.activeIndex].id == newImageRecieved[0].conversationId) {
                    messages.value.push(...newImageRecieved)
                }
            }
        })
    }

    const getAllMessages = async conversationId => {
        isLoading.value = true
        messages.value = []
        err.value = null
        try {
            const res = await messageService.getAllMessages(authStore.token, conversationId)
            if (res.statusCode !== 200) throw new Error(res.message)
            messages.value = res.data
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const sendMessage = async data => {
        isLoading.value = true
        err.value = null
        newMessage.value = null
        try {
            const res = await messageService.sendMessage(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            newMessage.value = res.data
            messages.value.push(res.data)
            socket.emit('new message', { data: newMessage.value, userRecievedId: getSender(userStore.user, conversationStore.conversations[conversationStore.activeIndex].User).id })
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const sendImage = async data => {
        isLoading.value = true
        err.value = null
        newMessage.value = null
        try {
            const res = await messageService.sendImage(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            newMessage.value = res.data
            messages.value.push(...res.data)
            socket.emit('new image', { data: newMessage.value, userRecievedId: getSender(userStore.user, conversationStore.conversations[conversationStore.activeIndex].User).id })
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const readMessages = async conversationId => {
        isLoading.value = true
        err.value = null
        try {
            const res = await messageService.readMessages(authStore.token, conversationId)
            if (res.statusCode !== 200) throw new Error(res.message)
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const emitComment = (data) => {
        // socket.emit('new notification', data)
    }

    return { activeIndex, err, result, isLoading, messages, newMessage, setupSocket, getAllMessages, sendMessage, sendImage, readMessages, emitComment }
})