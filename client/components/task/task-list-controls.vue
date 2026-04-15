<script setup lang="ts">
import { useUserStore } from '@/store/user-store';
import UiButton from '../ui/ui-button.vue';
import UiInput from '../ui/ui-input.vue';
import UiSelect from '../ui/ui-select.vue';
import UiTabs from '../ui/ui-tabs.vue';

interface Props {
    activeTab: string | null | undefined
    isShowAll: boolean | null | undefined
    search: string | null
}
const props = defineProps<Props>();
const emit = defineEmits(['change', 'update:isShowAll', 'update:search']);
const userStore = useUserStore();

const TABS = [
    { id: '', label: 'Все задачи' },
    { id: 'active', label: 'Активные' },
    { id: 'completed', label: 'Выполненные' },
];
const OPTIONS = [
    { label: 'По дате (по возрастанию)', field: 'dueDate', order: 'asc' },
    { label: 'По дате (по убыванию)', field: 'dueDate', order: 'desc' },
    { label: 'По названию (по возрастанию)', field: 'title', order: 'asc' },
    { label: 'По названию (по убыванию)', field: 'title', order: 'desc' },
    { label: 'По приоритету (по возрастанию)', field: 'priority', order: 'asc' },
    { label: 'По приоритету (по убыванию)', field: 'priority', order: 'desc' },
];

const activeTabLocal = ref<Props['activeTab']>(TABS[0].id);
watch(() => props.activeTab, (val) => {
    activeTabLocal.value = val;
}, {
    immediate: true,
});

const showAllText = computed(() => {
    return !props.isShowAll ? ' Отобразить задачи всех пользователей' : 'Скрыть задачи всех пользователей';
});

const selectedOption = ref(OPTIONS[0]);

watch([selectedOption, activeTabLocal], () => {
    const sortValue = selectedOption.value;
    emit('change', { filter: activeTabLocal.value, sortBy: sortValue.field, sortOrder: sortValue.order });
}, { deep: true });
</script>

<template>
    <div class="border-t flex justify-between items-center gap-4 items-center justify-center">
        <UiTabs v-model="activeTabLocal" :tabs="TABS">
            <template #right-content>
                <!-- <ClientOnly> -->
                <div class="flex items-center gap-3">
                    <UiInput
                        custom-class="grow min-w-[500px]" :model-value="search"
                        placeholder="Поиск: Название/Описание/Приоритет"
                        @update:model-value="emit('update:search', $event)"
                    />
                    <UiButton
                        v-if="!userStore.user?.user.roles.includes('ADMIN')" class="shrink-0 min-w-[333px]"
                        variant="secondary" @click=" emit('update:isShowAll')"
                    >
                        {{ showAllText }}
                    </UiButton>
                    <UiSelect v-model="selectedOption" class="min-w-[280px]" :options="OPTIONS" option-label="label" />
                </div>
                <!-- </ClientOnly> -->
            </template>
        </UiTabs>
    </div>
</template>

<style scoped></style>
