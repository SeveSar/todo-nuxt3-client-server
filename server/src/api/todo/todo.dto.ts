import { Types } from 'mongoose';
import { ITodoModel } from './todo.types';


export class TodoDTO {
    id: Types.ObjectId;
    title: ITodoModel['title'];
    description: ITodoModel['description'];
    dueDate: ITodoModel['dueDate'];
    isCompleted: ITodoModel['isCompleted'];
    createdBy: ITodoModel['createdBy'];
    priority: ITodoModel['priority']

    constructor(model: ITodoModel) {
        this.id = model._id;
        this.title = model.title;
        this.description = model.description;
        this.dueDate = model.dueDate;
        this.isCompleted = model.isCompleted;
        this.createdBy = model.createdBy;
        this.priority = model.priority
    }
}
