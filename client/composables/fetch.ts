import type { H3Event } from 'h3';
import type { FetchOptions } from 'ofetch';
import { appendResponseHeader, getRequestHeader } from 'h3';

export async function fetchWithCookie<T>(event: H3Event, url: string, options: FetchOptions & {
    method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
} = {}): Promise<T> {
    const headers = useRequestHeaders(['cookie']);
    console.log('cookie getRequestHeader:', getRequestHeader(event, 'cookie'));
    console.log('SSR REQUEST:', url);
    console.log('SSR HEADERS:', headers);
    const res = await $fetch.raw<T>(url, {
        credentials: 'include',
        method: 'GET',
        ...options,
        headers: {
            ...headers,
            ...(options.headers || {}),
        },
    });

    const cookies = res.headers.getSetCookie?.() || [];

    for (const cookie of cookies) {
        appendResponseHeader(event, 'set-cookie', cookie);
    }

    if (!res._data) {
        throw new Error(`Empty response from ${url}`);
    }
    return res._data;
}
