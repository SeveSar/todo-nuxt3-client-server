<template>
    <div class="h-screen">
        <div class="h-full flex items-center justify-center">
            <UiCard class="max-w-[1000px] w-full text-center">
                <h1 class="text-5xl font-bold mb-4">To-Do List </h1>
                <p class="text-gray-600 mb-6">Управляйте задачами эффективно</p>
                <AuthForm class="max-w-[400px] m-auto" />
            </UiCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import UiCard from '@/components/ui/ui-card.vue';
import AuthForm from '@/components/auth/auth-form.vue';


definePageMeta({
    layout: 'auth',
})


</script>

<style scoped></style>