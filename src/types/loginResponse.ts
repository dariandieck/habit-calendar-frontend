export type LoginResponse = {
    success: boolean
    token: string
    exp: string
    message?: string
}