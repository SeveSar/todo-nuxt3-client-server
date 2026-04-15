import type { FetchError } from 'ofetch';
import type { AnyObject, HttpClient } from './types';
import type { IUser } from '~/types/user';

import { useUserStore } from '~/store/user-store';
import { useUserApi } from './user/user.api';

let refreshTokenRequest: Promise<IUser> | null = null;

async function refreshToken() {
    const userStore = useUserStore();
    const userApi = useUserApi();
    try {
        if (refreshTokenRequest === null) {
            refreshTokenRequest = userApi.refresh();
        }

        const res = await refreshTokenRequest;
        refreshTokenRequest = null;
        return res;
    }
    catch {
        userStore.logout();
    }
}

export function useHttp(): HttpClient {
    const config = useRuntimeConfig();

    const request = async <T>(
        url: string,
        options: {
            method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
            query?: AnyObject
            body?: AnyObject
        } = {},
    ): Promise<T> => {
        try {
            const userStore = useUserStore();
            return await $fetch<T>(url, {
                baseURL: config.public.apiBaseURL,
                credentials: 'include',
                headers: {
                    Authorization: `Bearer ${userStore.user?.accessToken}`,
                },
                ...options,
            });
        }
        catch (e: unknown) {
            const err = e as FetchError;
            const userStore = useUserStore();
            if (err?.status === 401) {
                const res = await refreshToken();
                if (!res) { return Promise.reject(e); }
                userStore.setUser(res);
                return await $fetch<T>(url, {
                    baseURL: config.public.apiBaseURL,
                    credentials: 'include',
                    headers: {
                        Authorization: `Bearer ${res?.accessToken}`,
                    },
                    ...options,
                });
            }

            return Promise.reject(e);
        }
    };

    return {
        get: (url, query) =>
            request(url, { method: 'GET', query }),

        post: (url, body, query) =>
            request(url, { method: 'POST', body, query }),

        patch: (url, body, query) =>
            request(url, { method: 'PATCH', body, query }),

        delete: (url, query) =>
            request(url, { method: 'DELETE', query }),
    };
}
