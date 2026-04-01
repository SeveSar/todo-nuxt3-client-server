<template>
    <button :type="type" :disabled="disabled || isLoading" :class="[
        baseClasses,
        variantClasses,
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed min-h-[40px]'
    ]">
        <span class="flex items-center justify-center gap-2">
            <!-- Спиннер -->
            <svg v-if="isLoading" class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>

            <span v-if="!isLoading">
                <slot />
            </span>
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    variant?: 'primary' | 'secondary'
    isLoading?: boolean
}

const props = defineProps<Props>()

const baseClasses =
    'font-medium px-4 py-2 rounded-md shadow transition-colors focus:outline-none flex items-center justify-center'

const variantClasses = computed(() => {
    if (props.variant === 'secondary') {
        return `
      bg-white text-gray-700 border border-gray-300
      hover:bg-gray-50 active:bg-gray-100
    `
    }

    return `
    bg-blue-600 text-white
    hover:bg-blue-700 active:bg-blue-800
  `
})
</script>