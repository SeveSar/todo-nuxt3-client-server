<template>
    <div class="w-full" :class="customClass">

        <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1 text-left">
            {{ label }}
        </label>

        <div class="relative">

            <input v-bind="$attrs" v-model="currentModelValue" @focus="emit('onFocus')" @blur="emit('onBlur')"
                :disabled="disabled" :readonly="readonly" :class="[
                    'w-full border rounded-md shadow-sm py-2 pl-3 pr-10 text-sm transition',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                    disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white',
                    error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                ]" />


            <span v-if="icon" class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                <component :is="icon" class="w-5 h-5" />
            </span>
        </div>

        <p v-if="error" class="mt-1 text-sm text-red-500 text-left">
            {{ error }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    modelValue: string | null
    label?: string
    error?: string
    disabled?: boolean
    readonly?: boolean
    icon?: any,
    customClass?: string
}
const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'onFocus', 'onBlur'])

const currentModelValue = computed({
    get() {
        return props.modelValue
    },
    set(value: string | null) {
        emit('update:modelValue', value === '' ? null : value)
    }
})
</script>