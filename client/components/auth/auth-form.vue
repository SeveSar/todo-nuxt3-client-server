<template>
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <UiInput v-model="email" label="Email" placeholder="Enter email" @on-focus="resetField('email')"
            :error="emailError" :disabled="isAdmin" />
        <UiInput v-model="password" label="password" placeholder="Пароль" @on-focus="resetField('password')"
            :error="passwordError" :disabled="isAdmin" />
        <UiCheckbox v-model="isRemember">
            <span class="text-md text-gray-600">Запомнить меня?</span>
        </UiCheckbox>
        <UiButton type="submit">Войти</UiButton>
        <UiCheckbox v-model="isAdmin">
            <span class="text-md text-gray-600">Войти как админ?</span>
        </UiCheckbox>

    </form>
</template>

<script setup lang="ts">
import UiInput from '../ui/ui-input.vue'
import UiButton from '../ui/ui-button.vue';
import UiCheckbox from '../ui/ui-checkbox.vue';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';
const isAdmin = ref(false)
const schema = {
    email: yup.string().email('Email Невалидный').required('Email обязателен'),
    password: yup.string().min(6, 'Пароль должен содержать как минимум 6 символов').required('Пароль обязателен'),
    isRemember: yup.boolean(),
}

const { handleSubmit, resetField } = useForm();
const { value: email, errorMessage: emailError } = useField<string | null>('email', schema.email, { validateOnValueUpdate: false, initialValue: null });
const { value: password, errorMessage: passwordError } = useField<string | null>('password', schema.password, { validateOnValueUpdate: false, initialValue: null });
const { value: isRemember } = useField<boolean>('isRemember', schema.isRemember, { validateOnValueUpdate: false, initialValue: true });


const emit = defineEmits(['submit'])
const resetFields = (input: 'email' | 'password') => {
    if (input === 'email') {
        resetField('email', {
            value: email.value,
        })
    }
    if (input === 'password') {
        resetField('password', {
            value: password.value,
        })
    }
}

watch(email, () => {
    resetFields('email')
})
watch(password, () => {
    resetFields('password')
})
watch(isAdmin, () => {
    if (isAdmin.value) {
        email.value = ADMIN_EMAIL
        password.value = ADMIN_PASSWORD
    } else {
        email.value = null
        password.value = null
    }
})
const onSubmit = handleSubmit((values) => {
    emit('submit', { ...values, isAdmin: isAdmin.value })
})
</script>

<style scoped></style>