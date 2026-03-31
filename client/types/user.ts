export type TypeRole = 'USER' | 'ADMIN';

export interface IUser {
    accessToken: string;
    user: {
        id: string;
        name: string | null;
        email: string;
        avatar: string;
        roles: TypeRole[];
    }
}
