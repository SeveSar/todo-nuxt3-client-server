import { Schema, Types } from 'mongoose';
import { ENUM_PRIORITY } from './todo.constants';


type TypePriority = typeof ENUM_PRIORITY[number];

export interface ITodo {
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  createdBy: Schema.Types.ObjectId;
  priority: TypePriority;
}

interface ITodoModel extends ITodo {
  _id: Types.ObjectId;
}


export interface RequestQueries {
  filter?: 'active' | 'completed'
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  isShowAll?: boolean
  page?: string
  limit?: string
  search?: string

}


export { ITodoModel, TypePriority, ENUM_PRIORITY };
