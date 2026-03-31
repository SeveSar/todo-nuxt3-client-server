<script setup lang="ts">
import UiSpinner from './components/ui/ui-spinner.vue';
import UiToast from '@/components/ui/ui-toast.vue'
import { useUserStore } from './store/user-store';

const userStore = useUserStore()

onBeforeMount(() => {
    userStore.loadUser()
})

</script>

<template>
    <div class="h-screen flex fixed w-screen  backdrop-blur-3 z-10 backdrop-blur-lg" v-if="!userStore.isLoggedIn">
        <UiSpinner class="m-auto"></UiSpinner>
    </div>
    <UiToast />
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
