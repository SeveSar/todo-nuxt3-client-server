import type { ITask, ITaskQueries, ITaskResponse } from "@/types/task"


export const useTaskApi = () => {
    const { $api } = useNuxtApp()

    return {
        fetchAll(
            { sortBy, sortOrder, filter, isShowAll, page, limit, search }: ITaskQueries) {
            const actualParams = {
                page,
                limit,
                search
            } as ITaskQueries
            if (sortBy) actualParams.sortBy = sortBy
            if (sortOrder) actualParams.sortOrder = sortOrder
            if (filter) actualParams.filter = filter
            if (isShowAll) actualParams.isShowAll = isShowAll
            if (search) actualParams.search = search
            return $api.get<ITaskResponse>('/tasks', actualParams)
        },
        updateTask(id: string, data: Partial<ITask>) {
            return $api.patch<ITaskResponse>(`/tasks/${id}`, data)
        },
        createTask(data: Partial<ITask>) {
            return $api.post<ITask>('/tasks', data)
        },
        remove(id: string) {
            return $api.delete(`/tasks/${id}`)
        }
    }
}