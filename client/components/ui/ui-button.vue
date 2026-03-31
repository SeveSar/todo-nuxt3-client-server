<template>
    <button :type="type" :disabled="disabled" :class="[
        baseClasses,
        variantClasses,
        disabled && 'opacity-50 cursor-not-allowed'
    ]">
        <slot />
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    variant?: 'primary' | 'secondary'
}

const props = defineProps < Props > ()

const baseClasses =
    'font-medium px-4 py-2 rounded-md shadow transition-colors focus:outline-none'

const variantClasses = computed(() => {
    if (props.variant === 'secondary') {
        return `
      bg-white text-gray-700 border border-gray-300
      hover:bg-gray-50 active:bg-gray-100
    `
    }

    // default = primary
    return `
    bg-blue-600 text-white
    hover:bg-blue-700 active:bg-blue-800
  `
})
</script>