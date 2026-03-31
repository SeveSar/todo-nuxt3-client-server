import { Types } from 'mongoose';
import { IUserModel, TypeRole, IUser } from './user.types';

export class UserDTO {
  id: IUserModel['_id'];
  name: IUserModel['name'];
  email: IUserModel['email'];
  avatar: IUserModel['avatar'];
  roles: IUserModel['roles'];

  constructor(model: IUserModel) {
    this.id = model._id;
    this.name = model.name;
    this.email = model.email;
    this.avatar = model.avatar;
    this.roles = model.roles;
  }
}
