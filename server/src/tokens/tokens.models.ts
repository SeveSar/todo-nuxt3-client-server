import { model, Schema, Types } from 'mongoose';
import { IToken } from './tokens.types';

const tokenSchema = new Schema<IToken>(
  {
    refreshToken: { type: String, default: null },
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const RefreshTokenModel = model('RefreshToken', tokenSchema);

export { RefreshTokenModel };
