<template>
    <div class="bg-white rounded-lg shadow-md p-10 w-full" v-bind="attrs">
        <slot />
    </div>
</template>

<script setup lang="ts">
const attrs = useAttrs()
</script>