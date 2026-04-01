import { useUserStore } from '~/store/user-store'
import type { AnyObject, HttpClient } from './types'

let refreshTokenRequest: Promise<void> | null = null

const refreshToken = async () => {
    const userStore = useUserStore()
    try {
        if (refreshTokenRequest === null) {
            refreshTokenRequest = $fetch('/auth/refresh', {
                baseURL: useRuntimeConfig().public.apiBaseURL,
                credentials: 'include',
            })
        }

        await refreshTokenRequest
        refreshTokenRequest = null
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
            body?: AnyObject
        } = {}
    ): Promise<T> => {
        try {
            return await $fetch<T>(url, {
                baseURL: config.public.apiBaseURL,
                credentials: 'include',
                ...options
            })
        } catch (e: any) {
            if (e?.status === 401) {
                await refreshToken()

                return await $fetch<T>(url, {
                    baseURL: config.public.apiBaseURL,
                    credentials: 'include',
                    ...options
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