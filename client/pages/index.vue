<template>
    <div class="h-screen flex flex-col items-center p-6">
        <TaskList class="max-w-[85vw]"></TaskList>
    </div>
</template>

<script setup lang="ts">
import TaskList from '@/components/task/task-list.vue'
definePageMeta({
    layout: 'default',
})


</script>
