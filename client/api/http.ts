import { useUserStore } from '~/store/user-store'
import type { AnyObject, HttpClient } from './types'
import type { IUser } from '~/types/user'

let refreshTokenRequest: Promise<IUser> | null = null

const refreshToken = async () => {
    const userStore = useUserStore()
    try {
        if (refreshTokenRequest === null) {
            refreshTokenRequest = $fetch<IUser>('/auth/refresh', {
                baseURL: useRuntimeConfig().public.apiBaseURL,
                credentials: 'include',
            })
        }

        const res = await refreshTokenRequest
        refreshTokenRequest = null
        return res
    }
    catch (e) {
        userStore.logout()
    }

}

export const useHttp = (): HttpClient => {
    const config = useRuntimeConfig()

    const request = async <T>(
        url: string,
        options: {
            method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
            query?: AnyObject
            body?: AnyObject,
        } = {}
    ): Promise<T> => {
        try {
            const userStore = useUserStore()
            return await $fetch<T>(url, {
                baseURL: config.public.apiBaseURL,
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${userStore.user?.accessToken}`
                },
                ...options
            })
        } catch (e: any) {
            if (e?.status === 401) {
                const res = await refreshToken()

                return await $fetch<T>(url, {
                    baseURL: config.public.apiBaseURL,
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${res?.accessToken}`
                    },
                    ...options,
                })
            }

            throw e
        }
    }

    return {
        get: (url, query) =>
            request(url, { method: 'GET', query }),

        post: (url, body, query) =>
            request(url, { method: 'POST', body, query }),

        patch: (url, body, query) =>
            request(url, { method: 'PATCH', body, query }),

        delete: (url, query) =>
            request(url, { method: 'DELETE', query }),
    }
}