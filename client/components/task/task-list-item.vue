<template>
    <div class="flex items-center border-b border-gray-200 py-4">
        <div class="flex items-center gap-1 grow">
            <UiCheckbox :model-value="item?.isCompleted"
                :disabled="userStore.checkCanEditOrRemove(item.createdBy || '')"
                @update:model-value="$emit('edit-completed', { ...item, isCompleted: $event })" />
            <span>
                {{ item?.title }}
            </span>
        </div>
        <div class="grid grid-cols-3 gap-4 items-center">
            <div class="flex gap-3">
                <div class="min-w-[109px]">
                    <UiBadge v-if="isSameDate(item.dueDate || new Date(), new Date())" class="min-w-[109px]"
                        variant='warning'>
                        Сегодня
                    </UiBadge>
                    <UiBadge v-if="isDateOverdueByDay(item.dueDate || new Date())" class="min-w-[109px]"
                        variant='danger'>
                        Просрочено
                    </UiBadge>
                </div>
                <UiBadge class="min-w-[109px]" :variant="getPriorityVariant(item?.priority)">
                    {{ TEXT_BY_ENUM_PRIORITY[item?.priority] }}
                </UiBadge>
            </div>
            <div>
                {{ formatDateRu(item?.dueDate) }}
            </div>
            <div class="flex items-center gap-4">
                <UiButton :disabled="userStore.checkCanEditOrRemove(item.createdBy || '')"
                    @click="emit('edit', item?.id)">
                    Редактировать
                </UiButton>
                <UiButton variant="secondary" :disabled="userStore.checkCanEditOrRemove(item.createdBy || '')"
                    @click="emit('remove', item?.id)">
                    Удалить
                </UiButton>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import UiCheckbox from '../ui/ui-checkbox.vue';
import UiButton from '../ui/ui-button.vue';
import UiBadge from '../ui/ui-badge.vue';

import type { ITask, TypePriority } from '@/types/task';
import { TEXT_BY_ENUM_PRIORITY } from '../../configs/task.config';
import { formatDateRu, isDateOverdueByDay, isSameDate } from '@/shared/utils/date';
import { useUserStore } from '~/store/user-store';

const getPriorityVariant = (priority: TypePriority) => {
    switch (priority) {
        case 'IMPORTANT':
            return 'primary';
        case 'DEFAULT':
            return 'secondary';
        default:
            return 'secondary';
    }
};


const userStore = useUserStore();
const emit = defineEmits(['edit', 'edit-completed', 'remove']);
interface Props {
    item: ITask
}
defineProps<Props>();

</script>