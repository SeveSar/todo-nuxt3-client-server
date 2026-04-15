import antfu from '@antfu/eslint-config';

export default antfu({
    vue: true,
    typescript: true,
    stylistic: {
        indent: 4,
    },
    rules: {
        'no-console': 'off',
        'curly': ['error', 'multi-line'],
        'arrow-spacing': ['error', { before: true, after: true }],
        'style/semi': ['error', 'always'],
        'style/no-tabs': 'off',
        'style/max-statements-per-line': ['error', { max: 2 }],
    },
});
