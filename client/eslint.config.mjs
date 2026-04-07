import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.vue'], // указываем где правило применяется
        rules: {
            'no-console': 'off',               // твой пример
            '@typescript-eslint/no-explicit-any': 'off', // отключаем ругань на any
            'vue/no-multiple-template-root': 'off',
            "vue/first-attribute-linebreak": ["warn", {
                "singleline": "beside",
                "multiline": "beside"
            }]
        }
    }
)