import { useHttp } from '@/api/http';
export default defineNuxtPlugin(async () => {
    const http = useHttp();

    return {
        provide: {
            api: http,
        },
    };
});