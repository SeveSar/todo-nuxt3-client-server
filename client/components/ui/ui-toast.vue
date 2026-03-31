<template>
    <div class="fixed top-5 right-5 z-[9999] space-y-2">
        <transition-group name="toast">
            <div v-for="toast in toastStore.toasts" :key="toast.id"
                class="px-4 py-3 rounded-xl shadow-lg text-white flex items-center gap-3 min-w-[250px]"
                :class="getTypeClass(toast.type)">
                <span class="flex-1">{{ toast.message }}</span>

                <button @click="removeToast(toast.id)">✕</button>
            </div>
        </transition-group>
    </div>
</template>

<script setup>
import { useToastStore } from '@/store/toast-store'

const toastStore = useToastStore()

const getTypeClass = (type) => {
    switch (type) {
        case 'success':
            return 'bg-green-500'
        case 'error':
            return 'bg-red-500'
        default:
            return 'bg-gray-800'
    }
}
</script>

<style>
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from {
    opacity: 0;
    transform: translateY(-10px);
}

.toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
}
</style>