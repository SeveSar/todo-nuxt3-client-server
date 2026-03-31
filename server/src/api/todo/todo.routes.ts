import { Router } from 'express';
import { todoController } from './todo.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const todoRouter = Router();

todoRouter.get('/', authMiddleware, todoController.findAll);
todoRouter.get('/:id', authMiddleware, todoController.findOne);
todoRouter.patch('/:id', authMiddleware, todoController.update);
todoRouter.post('/', authMiddleware, todoController.create);
todoRouter.delete('/:id', authMiddleware, todoController.delete);

export { todoRouter };
