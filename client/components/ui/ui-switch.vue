<template>
    <SwitchGroup>
        <div class="flex items-center cursor-pointer">
            <Switch v-model="currentModelValue" :class='currentModelValue ? "bg-blue-600" : "bg-gray-200"'
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                <span :class='currentModelValue ? "translate-x-6" : "translate-x-1"'
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform" />
            </Switch>
            <SwitchLabel v-if="label" class="ml-4 cursor-pointer">{{ label }}</SwitchLabel>
        </div>
    </SwitchGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Switch, SwitchLabel, SwitchGroup } from '@headlessui/vue'
interface Props {
    modelValue: boolean
    label?: string
    name?: string
}

const props = defineProps<Props>()
const emits = defineEmits(['update:modelValue'])

const currentModelValue = computed({
    get() {
        return props.modelValue
    },
    set(value: boolean) {
        emits('update:modelValue', value)
    }
})
</script>

<style scoped></style>