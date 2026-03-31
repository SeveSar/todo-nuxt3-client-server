import { TypePriority } from "./todo.types";

export const ENUM_PRIORITY = ['DEFAULT', 'IMPORTANT'] as const;
export const PRIORITY_MAP: Record<string, TypePriority> = {
    'важно': 'IMPORTANT',
    'обычно': 'DEFAULT'
}
