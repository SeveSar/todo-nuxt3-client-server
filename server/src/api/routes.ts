import { Router } from 'express';
import { userRouter } from './user/user.routes';
import { todoRouter } from './todo/todo.routes';
const router = Router();
router.use('/auth', userRouter);
router.use('/tasks', todoRouter);

export { router };
