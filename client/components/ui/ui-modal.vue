<template>
    <Teleport to="body">
        <Transition name="modal-fade" @after-leave="onAfterLeave">
            <div v-show="isVisible" class="fixed inset-0 z-50 flex items-center justify-center" @click.self="close">
                <div class="relative bg-white rounded-xl w-full min-w-[300px] shadow-2xl" :class="modalWidthClass"
                    :style="modalStyle">
                    <button @click="close"
                        class="absolute top-3 right-3 z-10 text-gray-500 hover:text-black transition">
                        ✕
                    </button>

                    <div v-if="title || $slots.header" class="flex items-center pr-10 px-6 py-4 border-b">
                        <div class="text-3xl font-semibold">
                            <slot name="header">{{ title }}</slot>
                        </div>
                    </div>

                    <div class="p-6">
                        <slot />
                    </div>

                    <div v-if="$slots.footer" class="flex justify-end gap-2 px-6 py-4 border-t">
                        <slot name="footer" :close="close" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

type Size = 'sm' | 'md' | 'lg' | 'xl'

interface Props {
    title?: string
    size?: Size
    width?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'close'): void
}>()


const isVisible = ref(false)
const isRendered = ref(true)

onMounted(() => {
    requestAnimationFrame(() => {
        isVisible.value = true
    })
})

const close = () => {
    isVisible.value = false
}

const onAfterLeave = () => {
    isRendered.value = false
    emit('close')
}

const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', handleKey))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKey))

const modalWidthClass = computed(() => {
    if (props.width) return ''
    const sizeMap: Record<Size, string> = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    }
    return props.size ? sizeMap[props.size] : sizeMap['md']
})

const modalStyle = computed(() => {
    return props.width ? { width: props.width } : {}
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: all 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
}
</style>