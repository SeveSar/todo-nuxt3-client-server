<template>
    <div class="flex border-b border-gray-200 w-full">
        <div class="flex space-x-4 grow">
            <button v-for="tab in tabs" :key="tab.id" @click="selectTab(tab.id)" :class="[
                'pb-5 pt-5 px-4 text-md font-medium border-b-2',
                activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
            ]">
                {{ tab.label }}
            </button>
        </div>
        <slot name="right-content"></slot>
    </div>
</template>

<script lang="ts" setup>

interface Tab {
    id: string | number
    label: string
}

interface TabsProps {
    tabs: Tab[]
    modelValue?: string | number | null
}

const props = defineProps<TabsProps>()
const emit = defineEmits<{ (e: 'update:modelValue', value: string | number | null): void }>()


const activeTab = ref(props.modelValue ?? (props.tabs[0]?.id ?? ''))


watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal !== undefined && newVal !== null) activeTab.value = newVal
    }
)

function selectTab(id: string | number) {
    activeTab.value = id
    emit('update:modelValue', id)
}
</script>

<style scoped>
button {
    transition: color 0.2s, border-color 0.2s;
}
</style>
