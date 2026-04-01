import { ErrorHTTP } from '../../errors/errors.class';

import { Request, Response, NextFunction } from 'express';
import { loggerService } from '../../logger';
import { userService } from './user.services';
import { validationResult } from 'express-validator';

import { UserAuthRequest, UserUpdateRequest } from './user.types';
import { ACCESS_TOKEN_KEY, MAX_AGE_ACCESS_TOKEN, MAX_AGE_REFRESH_TOKEN, REFRESH_TOKEN_KEY } from './user.constants';

class UserController {
  // async register(req: Request<{}, {}, UserAuthRequest>, res: Response, next: NextFunction) {
  //   try {
  //     const { email, password } = req.body;

  //     const errors = validationResult(req);
  //     if (!errors.isEmpty()) {
  //       return next(new ErrorHTTP(400, 'Не корректный пароль или e-mail', errors));
  //     }

  //     const { tokens, userDTO } = await userService.createUser({ email, password });
  //     res.cookie('refreshToken', tokens.refreshToken, {
  //       httpOnly: true,
  //       secure: true,
  //       sameSite: 'none',
  //       maxAge: 7 * 24 * 60 * 60 * 1000,
  //     });

  //     // await basketService.createOrUpdateBasket(userDTO, cart);

  //     return res.json({
  //       accessToken: tokens.accessToken,
  //       user: userDTO,
  //     });
  //   } catch (e) {
  //     loggerService.err(`[Register]: ${e}`);
  //     next(e);
  //   }
  // }

  async loginOrRegister(req: Request<{}, {}, UserAuthRequest>, res: Response, next: NextFunction) {
    try {


      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(new ErrorHTTP(400, 'Не корректный пароль или e-mail', errors));
      }
      const { refreshToken, accessToken, userDTO } = await userService.getOrCreateUser(req.body);

      if (req.body.isRemember) {
        res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: MAX_AGE_REFRESH_TOKEN,
          path: '/'
        });
      }

      res.cookie(ACCESS_TOKEN_KEY, accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: MAX_AGE_ACCESS_TOKEN,
        path: '/'
      });

      // await basketService.createOrUpdateBasket(userDTO, cart);

      return res.json(userDTO);
    } catch (e) {
      console.dir(e);
      loggerService.err(`[Login]: ${e}`);
      next(e);
    }
  }

  async update(req: Request<{}, {}, UserUpdateRequest>, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const updatedUser = await userService.updateUser(req.body, id);
      return res.json(updatedUser);
    } catch (e) {
      next(e);
    }
  }
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.user;
      const user = await userService.getUser(id);
      return res.json({
        user: { ...user }
      });
    } catch (e) {
      loggerService.err(`[Login]: ${e}`);
      next(e);
    }
  }
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const accessToken = await userService.refresh(refreshToken);

      res.cookie(ACCESS_TOKEN_KEY, accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: MAX_AGE_ACCESS_TOKEN,
        path: '/'
      });
      return res.json({
        message: 'Токены обновлены',
      });
    } catch (e) {
      loggerService.err(`[Login]: ${e}`);
      next(e);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    console.log('logout, rrtrt')
    try {
      const { refreshToken } = req.cookies;
      await userService.logout(refreshToken);
      res.clearCookie(REFRESH_TOKEN_KEY);
      res.clearCookie(ACCESS_TOKEN_KEY);
      return res.json({ success: true });
    } catch (e) {
      next(e);
    }
  }
}

const userController = new UserController();
export { userController };
