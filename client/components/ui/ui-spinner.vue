<template>
    <div class="flex justify-center items-center">
        <div class="border-l-transparent border-r-transparent rounded-full animate-spin" :class="`${size} ${color}`">
        </div>
    </div>
</template>

<script setup>

defineProps({
    size: {
        type: String,
        default: 'w-14 h-14 border-4'
    },
    color: {
        type: String,
        default: 'border-t-blue-500 border-b-blue-500'
    }
})

</script>