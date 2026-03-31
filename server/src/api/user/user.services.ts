import { ErrorHTTP } from './../../errors/errors.class';
import { UserModel } from './user.models';
import bcryptjs from 'bcryptjs';
import { tokenService } from '../../tokens/tokens.services';
import { UserDTO } from './user.dto';

import { IUserModel, UserAuthRequest, UserUpdateRequest } from './user.types';
import { Types } from 'mongoose';

class UserService {

  async createUser(body: UserAuthRequest) {
    const hashPassword = await bcryptjs.hash(body.password, 7);
    const newUser = await UserModel.create({
      email: body.email,
      password: hashPassword,
      roles: body.isAdmin ? ['USER', 'ADMIN'] : ['USER'],
    });
    const userDTO = new UserDTO(newUser);
    const accessToken = tokenService.generateAccessToken({
      email: userDTO.email,
      id: userDTO.id,
      roles: userDTO.roles,
    });
    let data = { accessToken, userDTO } as { accessToken: string, userDTO: UserDTO, refreshToken: string };
    if (body.isRemember) {
      data.refreshToken = tokenService.generateRefreshToken({
        email: userDTO.email,
        id: userDTO.id,
        roles: userDTO.roles,
      });
      await tokenService.saveRefreshToken(userDTO.id, data.refreshToken);

    }
    return data;
  }

  async getOrCreateUser(body: UserAuthRequest) {
    const user = await UserModel.findOne({ email: body.email }).exec();
    if (!user) {
      return this.createUser(body);
    }

    const isValidPassword = bcryptjs.compareSync(body.password, user.password);
    if (!isValidPassword) {
      throw new ErrorHTTP(400, `Пароль неверный от email: ${body.email}`);
    }
    const userDTO = new UserDTO(user);
    const accessToken = tokenService.generateAccessToken({
      email: userDTO.email,
      id: userDTO.id,
      roles: userDTO.roles,
    });
    let data = { accessToken, userDTO } as { accessToken: string, userDTO: UserDTO, refreshToken: string };
    if (body.isRemember) {
      data.refreshToken = tokenService.generateRefreshToken({
        email: userDTO.email,
        id: userDTO.id,
        roles: userDTO.roles,
      });
      await tokenService.saveRefreshToken(userDTO.id, data.refreshToken);
    }
    return data;
  }

  async updateUser(userFields: UserUpdateRequest, userId: Types.ObjectId) {
    const updatedUser = await UserModel.findOneAndUpdate({ _id: userId }, userFields, { new: true });

    if (!updatedUser) throw new ErrorHTTP(404, 'Пользователь не существует');
    return updatedUser;
  }

  async getUser(id: Types.ObjectId) {
    const userFromDb = await UserModel.findById(id);
    console.log(userFromDb, 'userFromDb')
    if (!userFromDb) {
      throw new ErrorHTTP(404, 'Пользователь не существует');
    }
    return new UserDTO(userFromDb);
  }
  async refresh(refreshToken: string) {

    if (!refreshToken) {
      throw new ErrorHTTP(401, `Вы не авторизованы`);
    }
    const tokenFromDB = await tokenService.findRefreshToken(refreshToken);

    const userData = tokenService.validateRefreshToken(refreshToken);

    if (!tokenFromDB || !userData) {
      throw new ErrorHTTP(401, `Вы не авторизованы`);
    }
    const user = await UserModel.findById(userData.id);
    if (!user) {
      throw new ErrorHTTP(404, `Пользователь не существует`);
    }
    const accessToken = await tokenService.generateAccessToken({
      email: user.email,
      id: user._id,
      roles: user.roles,
    });

    return accessToken;
  }

  logout(refreshToken: string) {
    return tokenService.removeRefreshToken(refreshToken);
  }
}

const userService = new UserService();
export { userService };
