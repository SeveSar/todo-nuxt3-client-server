<template>
    <div class="h-screen">
        <div class="h-full flex items-center justify-center">
            <UiCard class="max-w-[1000px] w-full text-center">
                <h1 class="text-5xl font-bold mb-4">To-Do List </h1>
                <p class="text-gray-600 mb-6">Управляйте задачами эффективно</p>
                <AuthForm class="max-w-[400px] m-auto" @submit="onSubmit" />
            </UiCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import UiCard from '@/components/ui/ui-card.vue';
import AuthForm from '@/components/auth/auth-form.vue';
import { useUserStore } from '@/store/user-store';
import { useToastStore } from '@/store/toast-store';
import { getErrorMessage } from '@/shared/utils/get-error-message';
import type { AppError } from '@/shared/types/app-error';


definePageMeta({
    layout: 'auth',
})

const userStore = useUserStore()

const toastStore = useToastStore()

const onSubmit = async (formData: { email: string; password: string; isRemember: boolean, isAdmin?: boolean }) => {
    try {
        await userStore.login(formData)
        navigateTo({ name: 'index' })
    }
    catch (e) {
        const errorMessage = getErrorMessage(e as AppError)
        toastStore.addToast({
            type: 'error',
            message: errorMessage
        })
    }

}

</script>

<style scoped></style>