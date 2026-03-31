<template>
    <div>
        <DatePicker v-model="internalValue" :mode="mode || 'date'" :min-date="minDate"
            :popover="{ visibility: 'focus' }" class="w-full">
            <template #default="{ inputValue, inputEvents, togglePopover }">
                <div class="flex flex-col gap-1">
                    <div class="flex items-center gap-2">
                        <button v-if="labelLeft" @click="togglePopover" type="button">
                            {{ labelLeft }}
                        </button>
                        <UiInput :model-value="inputValue" v-on="inputEvents" @on-blur="togglePopover" readonly
                            :error="error" @on-focus="emit('onFocus')" />
                    </div>
                </div>
            </template>
        </DatePicker>
    </div>
</template>

<script setup lang="ts">
import { DatePicker } from 'v-calendar'
import UiInput from './ui-input.vue'

interface Props {
    modelValue: Date | string | null
    placeholder?: string
    minDate?: Date
    maxDate?: Date
    mode?: 'date' | 'dateTime' | 'time'
    labelLeft?: string
    error?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
    (e: 'update:modelValue', value: Date | null | string): void
    (e: 'onFocus'): void
}>()
const internalValue = computed({
    get() {
        return props.modelValue
    },
    set(value: Date | null | string) {
        emit('update:modelValue', value)
    }
})


</script>

<style scoped></style>