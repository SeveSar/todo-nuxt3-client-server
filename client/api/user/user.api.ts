import type { IUser } from '../../types/user';
import { appendResponseHeader } from 'h3';

export function useUserApi() {
    const { $api } = useNuxtApp();
    const config = useRuntimeConfig();
    return {
        login(data: Record<string, any>) {
            return $api.post<IUser>('/auth/login', data);
        },
        // loadUser() {
        //     return $api.get<IUser>('/auth/me');
        // },
        logout() {
            return $api.get('/auth/logout');
        },
        refresh() {
            return $fetch<IUser>('/auth/refresh', {
                baseURL: config.public.apiBaseURL,
                credentials: 'include',
                async onRequest(ctx) {
                    if (import.meta.server) {
                        // Forward cookies to the target

                        ctx.options.headers = useRequestHeaders(['cookie']) as any

                        // Save event for later, we need it to forward response cookies
                        ;(ctx as any).event = useRequestEvent();
                    }
                },
                async onResponse(ctx) {
                    if (import.meta.server && ctx.response.headers.get('set-cookie')) {
                        // Forward response cookies to the client
                        const cookieHeader = ctx.response.headers.get('set-cookie')!;
                        console.log(cookieHeader, 'cookieHeader');
                        appendResponseHeader((ctx as any).event, 'set-cookie', cookieHeader);
                    }
                },
            });
        },

    };
}
