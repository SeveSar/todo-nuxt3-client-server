// types/http.ts


export type AnyObject = Record<string, any>


export interface HttpClient {
    get<T>(url: string, query?: AnyObject): Promise<T>
    post<T>(url: string, body?: AnyObject, query?: AnyObject): Promise<T>
    patch<T>(url: string, body?: AnyObject, query?: AnyObject): Promise<T>
    delete<T>(url: string, query?: AnyObject): Promise<T>
}