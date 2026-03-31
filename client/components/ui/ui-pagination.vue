<template>
    <div class="flex items-center justify-center gap-2">

        <button class="px-3 py-1 border rounded disabled:opacity-50" :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)">
            Prev
        </button>


        <button v-for="page in pages" :key="page" class="px-3 py-1 border rounded" :class="{
            'bg-blue-500 text-white': page === currentPage
        }" @click="changePage(page)">
            {{ page }}
        </button>


        <button class="px-3 py-1 border rounded disabled:opacity-50" :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)">
            Next
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    total: number
    pageSize: number
    currentPage: number
    maxVisible?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'update:currentPage', value: number): void
}>()

const totalPages = computed(() => {
    return Math.ceil(props.total / props.pageSize)
})

const maxVisible = computed(() => props.maxVisible ?? 5)

const pages = computed(() => {
    const total = totalPages.value
    const current = props.currentPage
    const visible = maxVisible.value

    const half = Math.floor(visible / 2)

    let start = current - half
    let end = current + half

    if (start < 1) {
        start = 1
        end = visible
    }

    if (end > total) {
        end = total
        start = total - visible + 1
    }

    if (start < 1) start = 1

    const result: number[] = []
    for (let i = start; i <= end; i++) {
        result.push(i)
    }

    return result
})

function changePage(page: number) {
    if (page < 1 || page > totalPages.value) return
    emit('update:currentPage', page)
}
</script>