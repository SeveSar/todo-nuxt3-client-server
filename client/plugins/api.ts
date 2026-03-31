import { useHttp } from '@/api/http'
import { useUserStore } from '~/store/user-store'
import type { IUser } from '~/types/user'

export default defineNuxtPlugin(async () => {
    const http = useHttp()
    // const userStore = useUserStore()
    // try {
    //     const res = await http.get<IUser>('/auth/me')
    //     userStore.setUser(res)
    // }
    // catch (e) {
    //     console.log()
    // }
    // finally {
    //     userStore.isLoggedIn = true
    // }
    return {
        provide: {
            api: http,
        },
    }
})