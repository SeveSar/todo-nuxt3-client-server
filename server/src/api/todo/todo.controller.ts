import { ErrorHTTP } from './../../errors/errors.class';
import { Request, Response, NextFunction } from 'express';
import { todoService } from './todo.service';
import { ITodo, RequestQueries } from './todo.types'
import { Types } from 'mongoose';

class TodoController {
  async create(req: Request<{}, {}, ITodo>, res: Response, next: NextFunction) {
    try {
      const product = await todoService.create(req.body, req.user);
      return res.json(product);
    } catch (e: any) {
      next(e);
    }
  }

  async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ErrorHTTP(400, 'Не указан id задачи');
      }
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new ErrorHTTP(400, 'Некорректный id задачи');
      }
      const item = await todoService.findOne(id);
      return res.json(item);
    } catch (e) {
      next(e);
    }
  }

  async findAll(
    req: Request<
      {},
      {},
      {},
      RequestQueries
    >,
    res: Response,
    next: NextFunction
  ) {
    const { id, roles } = req.user
    const { filter, sortBy, sortOrder, isShowAll, page, limit, search } = req.query

    try {
      const todos = await todoService.findAll({
        userId: id,
        userRoles: roles,
        filter,
        sortBy,
        search,
        sortOrder: sortOrder || 'desc',
        isShowAll,
        page: Number(page) || 1,
        limit: Number(limit) || 10,
      })

      return res.json(todos)
    } catch (e) {
      next(e)
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new ErrorHTTP(400, 'Некорректный id задачи');
      }
      const newItem = await todoService.update(id, req.body, req.user);
      return res.json(newItem);
    } catch (e) {
      next(e);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = req.user
      const isValidId = Types.ObjectId.isValid(id);
      if (!isValidId) {
        throw new ErrorHTTP(400, 'Некорректный id задачи');
      }
      await todoService.delete(id, user);
      return res.json({ message: 'Задача удалёна' });
    } catch (e) {
      next(e);
    }
  }
}

const todoController = new TodoController();
export { todoController };
