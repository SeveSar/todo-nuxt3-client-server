<template>
    <UiCard v-bind="attrs" class="grow flex flex-col ">
        <div class="flex items-center justify-between p-5">
            <h1 class="text-4xl font-bold">TO-DO LIST</h1>
            <UiButton @click="modal = true">Добавить задачу</UiButton>
        </div>

        <TaskListControls :search="filters.search" :activeTab="filters.filter" :is-show-all="filters.isShowAll"
            @change="onChangeFilter" @update:isShowAll="onChangeShowAll" @update:search="filters.search = $event" />
        <div v-if="(pending || (!pending && !data?.data.length) || (!pending && !!filters.search && !data?.data.length))"
            class=" grow flex items-center justify-center">
            <UiSpinner v-if="pending" class="mt-8" />
            <span class="text-lg font-semibold" v-if="!pending && !!filters.search && !data?.data.length">Результаты не
                найдены</span>
            <span class="text-lg font-semibold" v-else-if="!pending && !data?.data.length">Список задач пустой</span>
        </div>
        <div class="flex flex-col mt-5" v-else>
            <Task v-for="task in data?.data" :key="task?.id" :item="task" @remove="onRemove" @edit="onEdit"
                @edit-completed="onEditCompleted"></Task>
        </div>
        <UiPagination v-if="data?.data.length" class="mt-auto" :currentPage="filters.page"
            :total="data?.meta.total || 0" :pageSize="filters.limit" @update:current-page="onChangePage">
        </UiPagination>
    </UiCard>
    <TaskCreateEditModal v-if="modal" @task-created="refresh" @close="onClose" :task-to-edit="chosenTask">
    </TaskCreateEditModal>

</template>

<script setup lang="ts">
import Task from './task-list-item.vue'
import UiButton from '../ui/ui-button.vue'
import UiPagination from '../ui/ui-pagination.vue'
import TaskCreateEditModal from './task-create-edit-modal.vue'
import UiCard from '../ui/ui-card.vue'
import UiSpinner from '../ui/ui-spinner.vue'
import TaskListControls from './task-list-controls.vue'
import type { ITask, ITaskQueries } from '@/types/task'
import { useToastStore } from '@/store/toast-store'
import { debounce } from '@/shared/utils/debounce'
import { getErrorMessage } from '@/shared/utils/get-error-message'
import type { AppError } from '@/shared/types/app-error'
import { useUserStore } from '~/store/user-store'
import { useTaskApi } from '~/api/task/task.api'

const GET_FILTER_VALUES = (): ITaskQueries => ({
    filter: null,
    sortBy: null,
    sortOrder: 'desc',
    isShowAll: false,
    page: 1,
    limit: 5,
    search: null
})
const attrs = useAttrs()
const modal = ref(false)
const chosenTask = ref<ITask | null>(null)
const toastStore = useToastStore()
const userStore = useUserStore()
const filters = ref(GET_FILTER_VALUES())
const taskApi = useTaskApi()
useQuerySync(filters, GET_FILTER_VALUES())

const { data, refresh, pending } = await useAsyncData('tasks', () => taskApi.fetchAll(filters.value), {
    watch: [() => userStore.user]
})
const onRemove = async (id: string) => {
    try {
        await taskApi.remove(id)
        toastStore.addToast({
            type: 'success',
            message: 'Задача успешно удалена'
        })
        console
        refresh()
    }
    catch (e) {
        const errorMessage = getErrorMessage(e as AppError)
        toastStore.addToast({
            type: 'error',
            message: errorMessage
        })
        console.log(e)
    }

}
const onEdit = (id: string) => {
    const task = data.value?.data?.find(t => t.id === id)
    if (!task) return
    chosenTask.value = task
    modal.value = true
}

const editTaskFetch = async (task: ITask) => {
    try {
        await taskApi.updateTask(task.id, { ...task })
    }
    catch (e) {
        const errorMessage = getErrorMessage(e as AppError)
        toastStore.addToast({
            type: 'error',
            message: errorMessage
        })
        console.log(e)
    }
    finally {
        refresh()
    }
}
const editTaskFetchDebounced = debounce(editTaskFetch, 250)

const onEditCompleted = async (task: ITask) => {
    const findTask = data.value?.data.find(t => t.id === task.id)
    if (!findTask) return

    findTask.isCompleted = task.isCompleted
    editTaskFetchDebounced(findTask)
}
const onChangeShowAll = () => {
    filters.value.isShowAll = !filters.value.isShowAll
    filters.value.page = 1
}
const onChangeFilter = ({ filter, sortBy, sortOrder }: ITaskQueries) => {
    filters.value.filter = filter
    filters.value.sortBy = sortBy
    filters.value.sortOrder = sortOrder
    filters.value.page = 1
}

const onChangePage = (page: number) => {
    filters.value.page = page
}

const onClose = () => {
    modal.value = false
    chosenTask.value = null
}
const debouncedRefresh = debounce(refresh)
watch(filters, () => {

    debouncedRefresh()
}, { deep: true })
</script>

<style scoped></style>