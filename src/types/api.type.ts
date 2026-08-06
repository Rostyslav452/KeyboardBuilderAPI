export interface APIResponse<T = undefined> {
    status: 'success' | 'error';
    message?: string;
    data?: T;
    accessToken?: string;
}
