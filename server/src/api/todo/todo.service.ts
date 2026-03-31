import { Types } from 'mongoose';
import { ErrorHTTP } from './../../errors/errors.class';
import { TodoModel } from './todo.models';
import { ITodo, RequestQueries } from './todo.types';
import { Request, Response, NextFunction } from 'express';
import { TodoDTO } from './todo.dto'
import { ITokenPayload } from '../user/user.types';
import { PRIORITY_MAP } from './todo.constants';

export class TodoService {
    async create(task: ITodo, user: ITokenPayload) {
        const newItem = await TodoModel.create({
            ...task,
            createdBy: user.id
        });

        return newItem;
    }

    async findOne(id: string) {
        const item = await TodoModel.findById(id).exec();
        if (!item) {
            throw new ErrorHTTP(404, 'Задача не найдена');
        }
        return item;
    }

    async findAll(
        {
            userId,
            userRoles,
            filter,
            sortBy,
            sortOrder = 'desc',
            isShowAll,
            page,
            limit,
            search
        }: Omit<RequestQueries, 'page' | 'limit'> & { userId: Types.ObjectId, userRoles: ('ADMIN' | 'USER')[], page: number, limit: number }

    ) {
        const query: any = {}

        if (!userRoles.includes('ADMIN') && !isShowAll) {
            query.createdBy = userId
        }


        if (filter === 'active') query.isCompleted = false
        if (filter === 'completed') query.isCompleted = true


        if (search && search.trim() !== '') {
            const regex = new RegExp(search.trim(), 'i')

            const searchLower = search.trim().toLowerCase()
            const priorityValue = PRIORITY_MAP[searchLower]

            const orConditions: any[] = [
                { title: regex },
                { description: regex },
            ]

            if (priorityValue) {
                orConditions.push({ priority: priorityValue })
            }

            query.$or = orConditions
        }

        const allowedSortFields = ['dueDate', 'priority', 'title'] as const
        const sortField = allowedSortFields.includes(sortBy as any) ? sortBy! : 'createdAt'
        const sortDirection = sortOrder === 'asc' ? 1 : -1


        const skip = (page - 1) * limit

        const total = await TodoModel.countDocuments(query)

        const items = await TodoModel.find(query)
            .sort({ [sortField]: sortDirection })
            .skip(skip)
            .limit(limit)
            .exec()

        return {
            data: items.map(item => new TodoDTO(item)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        }
    }

    async update(id: string, updateObject: Partial<ITodo>, user: ITokenPayload) {
        const item = await TodoModel.findById(id).exec();
        if (!item) {
            throw new ErrorHTTP(404, 'Задача не найдена');
        }
        if (user.roles.includes('ADMIN') || item.createdBy.toString() === user.id.toString()) {
            item.set({
                ...updateObject
            })
            await item.save()
        } else {
            throw new ErrorHTTP(403, 'Вы не можете обновить НЕ свою задачу т.к вы не Админ');
        }
        const itemDTO = new TodoDTO(item!)
        return itemDTO;
    }

    async delete(id: string, user: ITokenPayload) {
        const item = await TodoModel.findById(id).exec();
        if (!item) {
            throw new ErrorHTTP(404, 'Задача не найдена');
        }
        if (user.roles.includes('ADMIN') || item.createdBy.toString() === user.id.toString()) {
            await item.deleteOne()

        } else {
            throw new ErrorHTTP(403, 'Вы не можете удалить НЕ свою задачу т.к вы не Админ');
        }
    }
}

const todoService = new TodoService();
export { todoService };
