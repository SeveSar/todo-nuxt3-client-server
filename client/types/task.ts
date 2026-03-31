import { number } from "yup";
import type { ENUM_PRIORITY } from "../configs/task.config";


export type TypePriority = typeof ENUM_PRIORITY[keyof typeof ENUM_PRIORITY];

export interface ITask {
    id: string,
    title: string | null;
    description: string | null;
    dueDate: Date | null | string;
    isCompleted: boolean;
    createdBy: string | null;
    priority: TypePriority;
    meta: {}
}

export interface ITaskResponse {
    data: ITask[],
    meta: {
        total: number,
        page: number,
        limit: number,
        totalPages: number
    }

}

export interface ITaskQueries {
    filter?: string | null;
    sortBy?: string | null;
    sortOrder: 'asc' | 'desc';
    isShowAll?: boolean | null
    page: number,
    limit: number,
    search: string | null
}