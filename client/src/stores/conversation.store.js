import { ref } from 'vue'
import { defineStore } from 'pinia'
import conversationService from '@/services/conversation.service'
import { useAuthStore } from './auth.store'

export const useConversationStore = defineStore('conversation', () => {
    const authStore = useAuthStore()

    const activeIndex = ref(null)
    const err = ref(null)
    const result = ref(null)
    const isLoading = ref(false)
    const conversations = ref([])
    const totalReadMessage = ref(0)
    const searchResult = ref([])

    const fetchConversations = async () => {
        isLoading.value = true
        err.value = null
        try {
            console.log('ưee');
            
            const res = await conversationService.fetchConversations(authStore.token)
            if (res.statusCode !== 200) throw new Error(res.message)
            conversations.value = res.data.result
            searchResult.value = res.data.result
            if (res.data.totalReadMessage < 100) {
                totalReadMessage.value = res.data.totalReadMessage
            } else {
                totalReadMessage.value = 99
            }
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    const accessConversation = async data => {
        isLoading.value = true
        err.value = null
        try {
            const res = await conversationService.accessConversation(authStore.token, data)
            if (res.statusCode !== 200) throw new Error(res.message)
            result.value = res
            const isExist = conversations.value.findIndex(tes => tes.id === res.data.id)
            if (isExist === -1) {
                conversations.value.unshift(res.data)
                activeIndex.value = 0
            } else {
                activeIndex.value = isExist
            }
        } catch (error) {
            err.value = error.message
        } finally {
            isLoading.value = false
        }
    }

    return { activeIndex, err, result, isLoading, conversations, totalReadMessage, searchResult, fetchConversations, accessConversation }
})