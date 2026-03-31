import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', () => {
    type Toast = {
        id: number
        message: string
        type?: 'success' | 'error' | 'info'
        duration?: number
    }

    const toasts = ref<Toast[]>([])

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const newToast: Toast = {
            id: toasts.value.length + 1,
            type: 'info',
            duration: 3000,
            ...toast
        }

        toasts.value.push(newToast)

        setTimeout(() => {
            removeToast(newToast.id)
        }, newToast.duration)
    }

    const removeToast = (toastId: number) => {
        toasts.value = toasts.value.filter(t => t.id !== toastId)
    }



    return {
        toasts,
        addToast,
        removeToast,
    }
})