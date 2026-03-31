import type { FetchError } from 'ofetch'
import type { AppError } from '../types/app-error'


export function getErrorMessage(e: AppError): string {
    if (e instanceof Error) {
        if ('data' in e && (e as FetchError).data?.message) {
            return (e as FetchError).data.message
        }
        return e.message
    }

    return 'An error occurred'
}