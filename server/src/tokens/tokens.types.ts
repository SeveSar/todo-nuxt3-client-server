import { Types } from 'mongoose'

export interface IToken {
    refreshToken: string | null
    user: Types.ObjectId
}