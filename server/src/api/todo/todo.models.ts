import { model, Schema } from 'mongoose';
import { ITodoModel, ENUM_PRIORITY } from './todo.types';



const userSchema = new Schema<ITodoModel>(
  {
    title: { type: String, default: null },
    description: { type: String, default: null },
    dueDate: { type: Date, default: null },
    isCompleted: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    priority: { type: String, enum: ENUM_PRIORITY, default: ENUM_PRIORITY[0] },
  },
  {
    timestamps: true,
  }
);

const TodoModel = model<ITodoModel>('Todo', userSchema);
export { TodoModel };
