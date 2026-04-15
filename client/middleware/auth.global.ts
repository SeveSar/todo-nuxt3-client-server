import { useUserStore } from '@/store/user-store';

export default defineNuxtRouteMiddleware(async (to) => {
    const userStore = useUserStore();
    try {
        // if (import.meta.client) {
        const res = await userStore.loadUser();
        if (res) {
            if (to.name === 'auth') {
                navigateTo({ name: 'index', query: { ...to.query } });
            }
        }
        // }
    }
    catch (e) {
        console.log(e, 'eererere');
        if (to.name !== 'auth') {
            navigateTo({ name: 'auth' });
        }
    }

    if (userStore.isLoggedIn && !userStore.user && to.name !== 'auth') {
        return navigateTo({ name: 'auth', replace: true });
    }
});
