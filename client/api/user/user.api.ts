import type { IUser } from "../../types/user";

export const useUserApi = () => {
    const { $api } = useNuxtApp()

    return {
        login(data: Record<string, any>) {
            return $api.post<IUser>('/auth/login', data)
        },
        loadUser() {
            return $api.get<IUser>('/auth/me');
        },
        logout() {
            return $api.get('/auth/logout')
        }

    }
}
