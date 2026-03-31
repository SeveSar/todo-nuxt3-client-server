<template>
    <span :class="[baseClasses, variantClasses]">
        <slot />
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success'
}

const props = defineProps<Props>()

const baseClasses =
    'inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border transition-colors justify-center'

const variantClasses = computed(() => {
    switch (props.variant) {
        case 'secondary':
            return 'bg-white text-gray-700 border-gray-300'
        case 'danger':
            return 'bg-red-100 text-red-700 border-red-200'
        case 'warning':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200'
        case 'success':
            return 'bg-green-100 text-green-700 border-green-200'
        default:
            return 'bg-blue-100 text-blue-700 border-blue-200'
    }
})
</script>