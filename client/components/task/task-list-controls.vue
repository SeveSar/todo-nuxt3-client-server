<template>
    <div class="border-t flex justify-between items-center gap-4 items-center justify-center">
        <UiTabs :tabs="TABS" v-model="activeTab">
            <template #right-content>
                <div class="flex items-center gap-3">
                    <UiInput custom-class="grow min-w-[500px]" :model-value="search"
                        @update:model-value="emit('update:search', $event)"
                        placeholder="Поиск: Название/Описание/Приоритет">
                    </UiInput>
                    <UiButton class="shrink-0 min-w-[333px]" @click=" emit('update:isShowAll')" variant="secondary">
                        {{ showAllText }}
                    </UiButton>
                    <UiSelect class="min-w-[280px]" :options="OPTIONS" v-model="selectedOption" option-label="label">
                    </UiSelect>

                </div>
            </template>
        </UiTabs>
    </div>
</template>

<script setup lang="ts">
import UiTabs from '../ui/ui-tabs.vue'
import UiSelect from '../ui/ui-select.vue'
import UiInput from '../ui/ui-input.vue'
import UiButton from '../ui/ui-button.vue'
interface Props {
    activeTab: string | null | undefined,
    isShowAll: boolean | null | undefined,
    search: string | null
}
const emit = defineEmits(['change', 'update:isShowAll', 'update:search'])
const props = defineProps<Props>()

const TABS = [
    { id: '', label: 'Все задачи' },
    { id: 'active', label: 'Активные' },
    { id: 'completed', label: 'Выполненные' }
]
const OPTIONS = [
    { label: 'По дате (по возрастанию)', field: 'dueDate', order: 'asc' },
    { label: 'По дате (по убыванию)', field: 'dueDate', order: 'desc' },
    { label: 'По названию (по возрастанию)', field: 'title', order: 'asc' },
    { label: 'По названию (по убыванию)', field: 'title', order: 'desc' },
    { label: 'По приоритету (по возрастанию)', field: 'priority', order: 'asc' },
    { label: 'По приоритету (по убыванию)', field: 'priority', order: 'desc' },
]

const activeTab = ref<Props['activeTab']>(TABS[0].id)
watch(() => props.activeTab, (val) => {
    activeTab.value = val
}, {
    immediate: true
})


const showAllText = computed(() => {
    return !props.isShowAll ? ' Отобразить задачи всех пользователей' : 'Скрыть задачи всехпользователей'
})


const selectedOption = ref(OPTIONS[0])


watch([selectedOption, activeTab], () => {
    console.log(selectedOption.value)
    const sortValue = selectedOption.value
    emit('change', { filter: activeTab.value, sortBy: sortValue.field, sortOrder: sortValue.order })
}, { deep: true })
</script>

<style scoped></style>