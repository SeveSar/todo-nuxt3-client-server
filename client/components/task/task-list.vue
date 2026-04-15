<script setup lang="ts">
import type { AppError } from '@/shared/types/app-error';
import type { ITask, ITaskQueries } from '@/types/task';
import { debounce } from '@/shared/utils/debounce';
import { getErrorMessage } from '@/shared/utils/get-error-message';
import { useToastStore } from '@/store/toast-store';
import { useTaskApi } from '~/api/task/task.api';
import UiButton from '../ui/ui-button.vue';
import UiCard from '../ui/ui-card.vue';
import UiPagination from '../ui/ui-pagination.vue';
import UiSpinner from '../ui/ui-spinner.vue';
import TaskCreateEditModal from './task-create-edit-modal.vue';
import TaskListControls from './task-list-controls.vue';
import Task from './task-list-item.vue';

function GET_FILTER_VALUES(): ITaskQueries {
    return {
        filter: null,
        sortBy: null,
        sortOrder: 'desc',
        isShowAll: false,
        page: 1,
        limit: 5,
        search: null,
    };
}
const attrs = useAttrs();
const modal = ref(false);
const chosenTask = ref<ITask | null>(null);
const toastStore = useToastStore();
const filters = ref(GET_FILTER_VALUES());
const taskApi = useTaskApi();
useQuerySync(filters, GET_FILTER_VALUES());

const { data, refresh, pending } = await useAsyncData('tasks', () => taskApi.fetchAll(filters.value));
async function onRemove(id: string) {
    try {
        await taskApi.remove(id);
        toastStore.addToast({
            type: 'success',
            message: 'Задача успешно удалена',
        });
        refresh();
    }
    catch (e) {
        const errorMessage = getErrorMessage(e as AppError);
        toastStore.addToast({
            type: 'error',
            message: errorMessage,
        });
        console.log(e);
    }
}
function onEdit(id: string) {
    const task = data.value?.data?.find(t => t.id === id);
    if (!task) { return; }
    chosenTask.value = task;
    modal.value = true;
}

async function editTaskFetch(task: ITask) {
    try {
        await taskApi.updateTask(task.id, { ...task });
    }
    catch (e) {
        const errorMessage = getErrorMessage(e as AppError);
        toastStore.addToast({
            type: 'error',
            message: errorMessage,
        });
        console.log(e);
    }
    finally {
        refresh();
    }
}
const editTaskFetchDebounced = debounce(editTaskFetch, 250);

async function onEditCompleted(task: ITask) {
    const findTask = data.value?.data.find(t => t.id === task.id);
    if (!findTask) { return; }

    findTask.isCompleted = task.isCompleted;
    editTaskFetchDebounced(findTask);
}
function onChangeShowAll() {
    filters.value.isShowAll = !filters.value.isShowAll;
    filters.value.page = 1;
}
function onChangeFilter({ filter, sortBy, sortOrder }: ITaskQueries) {
    filters.value.filter = filter;
    filters.value.sortBy = sortBy;
    filters.value.sortOrder = sortOrder;
    filters.value.page = 1;
}
function onSearch(value: string) {
    filters.value.search = value;
    filters.value.page = 1;
}
function onChangePage(page: number) {
    filters.value.page = page;
}

function onClose() {
    modal.value = false;
    chosenTask.value = null;
}
const debouncedRefresh = debounce(refresh);
watch(filters, () => {
    debouncedRefresh();
}, { deep: true });
</script>

<template>
    <UiCard v-bind="attrs" class="grow flex flex-col ">
        <div class="flex items-center justify-between p-5">
            <h1 class="text-4xl font-bold">
                TO-DO LIST
            </h1>
            <UiButton @click="modal = true">
                Добавить задачу
            </UiButton>
        </div>

        <TaskListControls
            :search="filters.search" :active-tab="filters.filter" :is-show-all="filters.isShowAll"
            @change="onChangeFilter" @update:is-show-all="onChangeShowAll" @update:search="onSearch"
        />

        <div
            v-if="(pending || (!pending && !data?.data.length) || (!pending && !!filters.search && !data?.data.length))"
            class=" grow flex items-center justify-center"
        >
            <UiSpinner v-if="pending" class="mt-8" />
            <span v-if="!pending && !!filters.search && !data?.data.length" class="text-lg font-semibold">Результаты не
                найдены</span>
            <span v-else-if="!pending && !data?.data.length" class="text-lg font-semibold">Список задач пустой</span>
        </div>
        <div v-else class="flex flex-col mt-5">
            <Task
                v-for="task in data?.data" :key="task?.id" :item="task" @remove="onRemove" @edit="onEdit"
                @edit-completed="onEditCompleted"
            />
        </div>
        <UiPagination
            v-if="data?.data.length" class="mt-auto" :current-page="filters.page"
            :total="data?.meta.total || 0" :page-size="filters.limit" @update:current-page="onChangePage"
        />
    </UiCard>
    <TaskCreateEditModal v-if="modal" :task-to-edit="chosenTask" @task-created="refresh" @close="onClose" />
</template>

<style scoped></style>
