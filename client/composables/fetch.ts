import type { H3Event } from 'h3';
import type { FetchOptions } from 'ofetch';
import { appendResponseHeader } from 'h3';

type HttpMethod
    = | 'GET'
        | 'POST'
        | 'PUT'
        | 'PATCH'
        | 'DELETE'
        | 'OPTIONS'
        | 'HEAD';

export async function fetchWithCookie<T>(
    event: H3Event,
    url: string,
    options: FetchOptions & { method?: HttpMethod } = {},
): Promise<T> {
    const res = await $fetch.raw<T>(url, {
        ...options,
        method: options.method ?? 'GET',
        headers: {
            cookie: event.node.req.headers.cookie || '',
            ...(options.headers || {}),
        },
    });

    const cookies = res.headers.getSetCookie?.() || [];

    for (const cookie of cookies) {
        appendResponseHeader(event, 'set-cookie', cookie);
    }

    return res._data!;
}
