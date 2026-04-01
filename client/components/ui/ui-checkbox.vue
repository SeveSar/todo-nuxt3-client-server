<template>
    <label class="inline-flex items-center select-none"
        :class="disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'">
        <input type="checkbox" class="sr-only" :checked="modelValue" :disabled="disabled" @change="onChange" />

        <div class="w-5 h-5 border-2 rounded-md flex items-center justify-center transition-colors duration-200" :class="[
            modelValue
                ? 'bg-blue-500 border-blue-500'
                : 'bg-white border-gray-400',
            disabled && 'bg-gray-200 border-gray-300'
        ]">
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
    disabled?: boolean
}
const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
}>()

const onChange = (e: Event) => {
    if (props.disabled) return

    const target = e.target as HTMLInputElement
    emit('update:modelValue', target.checked)
}
</script>