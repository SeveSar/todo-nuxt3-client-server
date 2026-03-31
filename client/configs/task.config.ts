export const ENUM_PRIORITY = {
    DEFAULT: 'DEFAULT',
    IMPORTANT: 'IMPORTANT'
} as const


export const TEXT_BY_ENUM_PRIORITY = {
    [ENUM_PRIORITY['DEFAULT']]: 'Обычно',
    [ENUM_PRIORITY['IMPORTANT']]: 'Важно'
}