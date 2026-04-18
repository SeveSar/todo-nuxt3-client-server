<script setup lang="ts">
import type { ITask } from '@/types/task';
import { useField } from 'vee-validate';
import { computed, watch } from 'vue';
import * as yup from 'yup';
import { ENUM_PRIORITY, TEXT_BY_ENUM_PRIORITY } from '@/configs/task.config';
import { toISO } from '@/shared/utils/date';

import { useToastStore } from '@/store/toast-store';
import { useTaskApi } from '~/api/task/task.api';
import UiButton from '../ui/ui-button.vue';
import UiDatePicker from '../ui/ui-date-picker.vue';
import UiInput from '../ui/ui-input.vue';
import UiModal from '../ui/ui-modal.vue';
import UiSelect from '../ui/ui-select.vue';
import UiTextarea from '../ui/ui-textarea.vue';

interface Props {
    taskToEdit?: ITask | null
}
const props = defineProps<Props>();
const emit = defineEmits(['taskCreated', 'close']);

const OPTIONS = Object.values(ENUM_PRIORITY).map(value => ({
    label: TEXT_BY_ENUM_PRIORITY[value],
    value,
}));
const nowDate = useState('default-date', () => new Date());
function GET_DEFAULT_FORM_DATA() {
    return ({
        title: null,
        description: null,
        dueDate: nowDate.value,
        priority: OPTIONS[0].value,
    }) as ITask;
}

const schema = {
    title: yup.string().required('Название задачи обязательно'),
    description: yup.string().required('Описание задачи обязательно').min(2, 'Описание должно содержать минимум 2 символа'),
    dueDate: yup.date().required('Дата выполнения обязательна'),
    priority: yup.string().required('Приоритет обязателен'),
};

// Если редактируем задачу, подставляем значения
const initialData = computed(() => props.taskToEdit ?? GET_DEFAULT_FORM_DATA());
console.log('initialData', initialData.value);
const { value: titleModel, errorMessage: titleError, validate: validateTitle, resetField: resetTitleField }
    = useField<ITask['title']>('title', schema.title, { validateOnValueUpdate: false, initialValue: initialData.value.title });
const { value: descriptionModel, errorMessage: descriptionError, validate: validateDescription, resetField: resetDescriptionField }
    = useField<ITask['description']>('description', schema.description, { validateOnValueUpdate: false, initialValue: initialData.value.description });
const { value: dueDateModel, errorMessage: dueDateError, validate: validateDueDate, resetField: resetDueDateField }
    = useField<ITask['dueDate']>('dueDate', schema.dueDate, { validateOnValueUpdate: false, initialValue: initialData.value.dueDate });
const { value: priorityModel, errorMessage: priorityError, validate: validatePriority, resetField: resetPriorityField }
    = useField<ITask['priority']>('priority', schema.priority, { validateOnValueUpdate: false, initialValue: initialData.value.priority });

const taskApi = useTaskApi();
const toastStore = useToastStore();

async function onSubmit() {
    const results = await Promise.all([validateTitle(), validateDescription(), validateDueDate(), validatePriority()]);
    if (results.some(r => !r.valid)) { return; }

    const data = {
        title: titleModel.value,
        description: descriptionModel.value,
        priority: priorityModel.value,
        dueDate: toISO(dueDateModel.value),
    } as ITask;

    try {
        if (props.taskToEdit) {
            await taskApi.updateTask(props.taskToEdit.id, data);
            toastStore.addToast({ message: 'Задача успешно обновлена', type: 'success' });
        }
        else {
            await taskApi.createTask(data);
            toastStore.addToast({ message: 'Задача успешно добавлена', type: 'success' });
        }
        emit('taskCreated');
    }
    catch (e) {
        console.log(e);
        toastStore.addToast({ message: 'Ошибка при сохранении задачи', type: 'error' });
    }
    finally {
        emit('close');
    }
}

watch(titleModel, () => {
    resetTitleField({ value: titleModel.value });
});
watch(descriptionModel, () => {
    resetDescriptionField({ value: descriptionModel.value });
});
watch(dueDateModel, () => {
    resetDueDateField({ value: dueDateModel.value });
});
watch(priorityModel, () => {
    resetPriorityField({ value: priorityModel.value });
});
</script>

<template>
    <UiModal :title="taskToEdit ? 'Редактировать задачу' : 'Новая задача'" size="xl" @close="emit('close')">
        <template #default>
            <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
                <UiInput v-model="titleModel" placeholder="Название задачи" :error="titleError" />
                <UiTextarea v-model="descriptionModel" placeholder="Описание задачи" :error="descriptionError" />

                <div class="flex items-center gap-2">
                    <UiDatePicker
                        v-model="dueDateModel" :min-date="nowDate" label-left="Дата:" :error="dueDateError"
                        @on-focus="resetDueDateField({ value: dueDateModel })"
                    />
                </div>

                <div class="flex items-center gap-2">
                    <label>Приоритет:</label>
                    <UiSelect
                        v-model="priorityModel" class="min-w-[200px]" :options="OPTIONS" placeholder="Выберите..."
                        :error="priorityError" option-value="value"
                    />
                </div>
            </form>
        </template>

        <template #footer="{ close }">
            <UiButton variant="secondary" @click="close">
                Отмена
            </UiButton>
            <UiButton type="submit" @click="onSubmit">
                {{ taskToEdit ? 'Сохранить' : 'Добавить' }}
            </UiButton>
        </template>
    </UiModal>
</template>
