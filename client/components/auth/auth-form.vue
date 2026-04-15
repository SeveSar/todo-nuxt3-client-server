<script setup lang="ts">
import type { AppError } from '~/shared/types/app-error';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';
import { getErrorMessage } from '~/shared/utils/get-error-message';
import { useToastStore } from '~/store/toast-store';
import { useUserStore } from '~/store/user-store';
import UiButton from '../ui/ui-button.vue';
import UiCheckbox from '../ui/ui-checkbox.vue';
import UiInput from '../ui/ui-input.vue';

defineEmits(['submit']);
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';
const isAdmin = ref(false);
const userStore = useUserStore();
const isLoadingForm = ref(false);

const toastStore = useToastStore();

const schema = {
    email: yup.string().email('Email Невалидный').required('Email обязателен'),
    password: yup.string().min(6, 'Пароль должен содержать как минимум 6 символов').required('Пароль обязателен'),
    isRemember: yup.boolean(),
};

const { handleSubmit, resetField } = useForm();
const { value: email, errorMessage: emailError } = useField<string | null>('email', schema.email, { validateOnValueUpdate: false, initialValue: null });
const { value: password, errorMessage: passwordError } = useField<string | null>('password', schema.password, { validateOnValueUpdate: false, initialValue: null });
const { value: isRemember } = useField<boolean>('isRemember', schema.isRemember, { validateOnValueUpdate: false, initialValue: true });

function resetFields(input: 'email' | 'password') {
    if (input === 'email') {
        resetField('email', {
            value: email.value,
        });
    }
    if (input === 'password') {
        resetField('password', {
            value: password.value,
        });
    }
}

watch(email, () => {
    resetFields('email');
});
watch(password, () => {
    resetFields('password');
});
watch(isAdmin, () => {
    if (isAdmin.value) {
        email.value = ADMIN_EMAIL;
        password.value = ADMIN_PASSWORD;
    }
    else {
        email.value = null;
        password.value = null;
    }
});
const onSubmit = handleSubmit(async (values) => {
    try {
        isLoadingForm.value = true;
        await userStore.login({ ...values, isAdmin: isAdmin.value });
        navigateTo({ name: 'index' });
    }
    catch (e) {
        const errorMessage = getErrorMessage(e as AppError);
        toastStore.addToast({
            type: 'error',
            message: errorMessage,
        });
    }
    finally {
        isLoadingForm.value = false;
    }
});
</script>

<template>
    <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
        <UiInput
            v-model="email" label="Email" placeholder="Enter email" :error="emailError" :disabled="isAdmin"
            @on-focus="resetField('email')"
        />
        <UiInput
            v-model="password" label="password" placeholder="Пароль" :error="passwordError" :disabled="isAdmin"
            @on-focus="resetField('password')"
        />
        <UiCheckbox v-model="isRemember">
            <span class="text-md text-gray-600">Запомнить меня?</span>
        </UiCheckbox>
        <UiButton type="submit" :is-loading="isLoadingForm">
            Войти
        </UiButton>
        <UiCheckbox v-model="isAdmin">
            <span class="text-md text-gray-600">Войти как админ?</span>
        </UiCheckbox>
    </form>
</template>

<style scoped></style>
