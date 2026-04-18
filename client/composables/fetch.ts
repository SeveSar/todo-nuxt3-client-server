import type { H3Event } from 'h3';
import { appendResponseHeader } from 'h3';

export async function fetchWithCookie<T>(event: H3Event, url: string, options: any = {}): Promise<T> {
    const res = await $fetch.raw<T>(url, {
        ...options,
        headers: {
            ...useRequestHeaders(['cookie']),
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
    console.log('SSR REQUEST:', url);
    console.log('STATUS:', res.status);
    console.log('HEADERS:', res.headers);
    return res._data;
}
