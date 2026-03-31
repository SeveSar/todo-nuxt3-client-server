import { useRoute, useRouter } from '#app'
import { watch } from 'vue'
import type { ITaskQueries } from '~/types/task'


export function useQuerySync<T extends Record<string, any>>(
    state: Ref<T>,
    defaults: T
) {
    const route = useRoute()
    const router = useRouter()

    const parseQuery = (query: Record<string, any>) => {
        Object.keys(defaults).forEach((key) => {
            const typedKey = key as keyof T
            const value = query[key]

            if (value === undefined) {
                state.value[typedKey] = defaults[key]
                return
            }

            if (typeof defaults[key] === 'number') {
                state.value[typedKey] = Number(value) as T[keyof T]
            } else if (typeof defaults[key] === 'boolean') {
                state.value[typedKey] = (value === 'true') as T[keyof T]
            } else {
                state.value[typedKey] = value as T[keyof T]
            }
        })
    }

    const buildQuery = () => {
        const query: Record<string, any> = {}

        Object.keys(state.value).forEach((key) => {
            const value = state.value[key]
            const def = defaults[key]


            if (value === def || value === null) return

            query[key] = String(value)
        })
        console.log(state.value, 'build quer')

        return query
    }

    const updateQuery = () => {
        const query = buildQuery()
        navigateTo({
            query
        }, { replace: true })
    }

    parseQuery(route.query)


    watch(
        () => route.query,
        (q) => parseQuery(q),
        { deep: true }
    )


    watch(
        () => state.value,
        () => {
            updateQuery()

        },
        { deep: true }
    )
}