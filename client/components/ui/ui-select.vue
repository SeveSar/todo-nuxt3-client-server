<template>
    <div ref="containerRef" class="relative">
        <label v-if="label" class="block mb-1 text-sm font-medium text-gray-700">
            {{ label }}
        </label>

        <button type="button" @click="toggle" @keydown="handleKey" :disabled="disabled" class="w-full text-left px-3 py-2 border rounded-lg bg-white focus:outline-none
             transition focus:ring-2 focus:ring-blue-500
             disabled:bg-gray-100 disabled:cursor-not-allowed
             flex justify-between items-center"
            :class="[error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300']">
            <span>{{ selectedLabel || placeholder }}</span>
            <svg class="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>

        <ul v-if="open" class="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
            <li v-for="(opt, index) in options" :key="index" @click="select(opt)" @mouseenter="highlightedIndex = index"
                :class="[
                    'px-3 py-2 cursor-pointer',
                    highlightedIndex === index ? 'bg-blue-100' : '',
                    isSelected(opt) ? 'bg-blue-200 font-semibold' : ''
                ]">
                {{ getOptionLabel(opt) }}
            </li>
        </ul>

        <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'

interface Props {
    modelValue: any
    options: any[]
    label?: string
    placeholder?: string
    disabled?: boolean
    error?: string
    optionLabel?: string
    optionValue?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'update:modelValue', value: any): void }>()

const open = ref(false)
const highlightedIndex = ref(-1)
const containerRef = ref<HTMLElement | null>(null)


const getOptionLabel = (opt: any) => {
    const field = props.optionLabel || 'label'
    return opt[field] ?? ''
}


const selectedLabel = computed(() => {
    if (!props.modelValue) return ''
    if (props.optionValue) {
        const opt = props.options.find(o => o[props.optionValue!] === props.modelValue)
        return opt ? getOptionLabel(opt) : ''
    } else {
        return getOptionLabel(props.modelValue)
    }
})

const isSelected = (opt: any) => {
    if (props.optionValue) {
        return opt[props.optionValue] === props.modelValue
    } else {
        return JSON.stringify(opt) === JSON.stringify(props.modelValue)
    }
}

const toggle = () => {
    if (props.disabled) return
    open.value = !open.value
}

const select = (opt: any) => {
    if (props.optionValue) {
        emit('update:modelValue', opt[props.optionValue])
    } else {
        emit('update:modelValue', opt)
    }
    open.value = false
}

const handleKey = (e: KeyboardEvent) => {
    if (!open.value) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            open.value = true
            e.preventDefault()
        }
        return
    }

    if (e.key === 'ArrowDown') {
        highlightedIndex.value = (highlightedIndex.value + 1) % props.options.length
        e.preventDefault()
    } else if (e.key === 'ArrowUp') {
        highlightedIndex.value = (highlightedIndex.value - 1 + props.options.length) % props.options.length
        e.preventDefault()
    } else if (e.key === 'Enter') {
        if (highlightedIndex.value >= 0 && highlightedIndex.value < props.options.length) {
            select(props.options[highlightedIndex.value])
        }
        e.preventDefault()
    } else if (e.key === 'Escape') {
        open.value = false
    }
}

const handleClickOutside = (e: MouseEvent) => {
    if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
        open.value = false
    }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))

watch(open, (v) => {
    if (!v) highlightedIndex.value = -1
})
</script>