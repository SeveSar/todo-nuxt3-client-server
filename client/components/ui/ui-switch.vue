<script setup lang="ts">
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue';
import { computed } from 'vue';

interface Props {
    modelValue: boolean
    label?: string
    name?: string
}

const props = defineProps<Props>();
const emits = defineEmits(['update:modelValue']);

const currentModelValue = computed({
    get() {
        return props.modelValue;
    },
    set(value: boolean) {
        emits('update:modelValue', value);
    },
});
</script>

<template>
    <SwitchGroup>
        <div class="flex items-center cursor-pointer">
            <Switch
                v-model="currentModelValue" :class="currentModelValue ? &quot;bg-blue-600&quot; : &quot;bg-gray-200&quot;"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                <span
                    :class="currentModelValue ? &quot;translate-x-6&quot; : &quot;translate-x-1&quot;"
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
            </Switch>
            <SwitchLabel v-if="label" class="ml-4 cursor-pointer">
                {{ label }}
            </SwitchLabel>
        </div>
    </SwitchGroup>
</template>

<style scoped></style>
