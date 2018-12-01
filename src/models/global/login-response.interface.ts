export interface LoginResponse {
    uid ?: string,
    error ?: {
        msg ?: string,
        code?: string,
    }
}