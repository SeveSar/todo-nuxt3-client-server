<template>
    <div class="w-full">
        <label v-if="label" class="block mb-1 text-sm font-medium text-gray-700">
            {{ label }}
        </label>

        <textarea ref="textareaRef" :value="modelValue" :placeholder="placeholder" :rows="rows" :disabled="disabled"
            @input="onInput" class="w-full rounded-lg border px-3 py-2 text-sm outline-none transition resize-none
             focus:ring-2 focus:ring-blue-500
             disabled:bg-gray-100 disabled:cursor-not-allowed h-auto overflow-hidden min-h-[120px]"
            :class="[error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300']" />

        <p v-if="error" class="mt-1 text-sm text-red-500 text-left">{{ error }}</p>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch, nextTick, onMounted } from 'vue'

/* Props с типами */
interface Props {
    modelValue: string | null
    label?: string
    placeholder?: string
    rows?: number
    error?: string
    autoResize?: boolean
    disabled?: boolean
}

const props = defineProps<Props>()



const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()


const textareaRef = ref<HTMLTextAreaElement | null>(null)


const resize = () => {
    if (!props.autoResize || !textareaRef.value) return
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
}


const onInput = (e: Event) => {
    const target = e.target as HTMLTextAreaElement
    emit('update:modelValue', target.value)
    resize()
}


watch(() => props.modelValue, () => nextTick(resize))


onMounted(resize)
</script>