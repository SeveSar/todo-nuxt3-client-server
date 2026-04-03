import { useHttp } from '@/api/http'
import { useUserStore } from '~/store/user-store'
import type { IUser } from '~/types/user'

export default defineNuxtPlugin(async () => {
    const http = useHttp()

    return {
        provide: {
            api: http,
        },
    }
})