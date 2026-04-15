<script setup lang="ts">
import UiToast from '@/components/ui/ui-toast.vue';
import UiSpinner from './components/ui/ui-spinner.vue';
import { useUserStore } from './store/user-store';

const userStore = useUserStore();
</script>

<template>
    <div v-if="!userStore.isLoggedIn" class="h-screen flex fixed w-screen  backdrop-blur-3 z-10 backdrop-blur-lg">
        <UiSpinner class="m-auto" />
    </div>

    <UiToast />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
