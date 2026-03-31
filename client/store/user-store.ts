import type { IUser } from "../types/user"
import { useUserApi } from '@/api/user/user.api'


export const useUserStore = defineStore('user', () => {
    const useTaskApi = useUserApi()
    const user = ref<IUser | null>(null)
    const isLoggedIn = ref(false)

    const route = useRoute()
    const setUser = (userData: IUser | null) => {
        user.value = userData
    }

    const login = async (data: { email: string; password: string; isRemember: boolean }) => {
        const user = await useTaskApi.login(data)
        setUser(user)
        return user
    }

    const clearUser = () => {
        user.value = null
    }
    const loadUser = async () => {
        if (isLoggedIn.value) return
        try {
            const user = await useTaskApi.loadUser()
            setUser(user)
            navigateTo({ name: 'index', query: { ...route.query } })
        }
        catch (e) {
            console.log(e, 'trtrtrt')
        }
        finally {
            isLoggedIn.value = true
        }
        return user

    }
    const logout = () => {
        clearUser()
        navigateTo('/auth')
        return useTaskApi.logout()
    }
    const checkCanEditOrRemove = (createdBy: string | null) => {
        if (!user.value?.user || !createdBy) return

        return !(user.value.user.id === createdBy || user.value?.user.roles.includes('ADMIN'))
    }




    return {
        user,
        isLoggedIn,
        logout,
        setUser,
        clearUser,
        loadUser,
        login,
        checkCanEditOrRemove
    }
})