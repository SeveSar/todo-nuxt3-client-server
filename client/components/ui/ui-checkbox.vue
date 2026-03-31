<template>
    <label class="inline-flex items-center cursor-pointer select-none">
        <input type="checkbox" class="sr-only" :checked="modelValue"
            @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)" />
        <div class="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center transition-colors duration-200"
            :class="modelValue ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-400'">
            <svg v-if="modelValue" class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <span class="ml-2 text-gray-700">
            <slot></slot>
        </span>
    </label>
</template>

<script setup lang="ts">
interface Props {
    modelValue: boolean
}
const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()
</script>