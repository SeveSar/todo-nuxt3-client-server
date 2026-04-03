import { useUserStore } from '@/store/user-store'


export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore()

  if (import.meta.client) {
    await userStore.loadUser()
  }

  if (userStore.isLoggedIn && !userStore.user && to.name !== 'auth') {
    return navigateTo({ name: 'auth', replace: true })
  }
})