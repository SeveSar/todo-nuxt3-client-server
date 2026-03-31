import type { HttpClient } from '@/api/types'

declare module '#app' {
    interface NuxtApp {
        $api: HttpClient
    }
}

declare module 'vue' {
    interface ComponentCustomProperties {
        $api: HttpClient
    }
}

export { }