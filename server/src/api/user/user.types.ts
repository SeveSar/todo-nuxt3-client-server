// import { IIngredient, IIngredientModel, ISize } from './../product/product.types';
import { Types } from 'mongoose';
// import { IDough, ISizeModel } from '../product/product.types';
// import { IDoughModel } from '../product/product.types';

type TypeRole = 'USER' | 'ADMIN';

export interface IUser {
  name: string;
  email: string;
  avatar: string;
  roles: TypeRole[];
}

interface IUserModel extends IUser {
  _id: Types.ObjectId;
  password: string;
}
interface ITokenPayload {
  email: IUser['email'];
  id: Types.ObjectId;
  roles: TypeRole[];
}


interface UserAuthRequest {
  email: IUser['email'];
  password: IUserModel['password'];
  isRemember: boolean;
  isAdmin?: boolean;
  // cart?: ICart[];
}



export type UserUpdateRequest = Omit<IUser, 'roles'> & { password: IUserModel['password'] };

export { TypeRole, IUserModel, ITokenPayload, UserAuthRequest };
