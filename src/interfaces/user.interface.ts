export interface Auth {
   email: string
   password: string
}

export interface User extends Auth {
   id?: any
   username: string
   favorites?: string[]
}

export interface UpdateUser {
   newUsername?: string
   password?: string
   newPassword?: string
}

export interface RegisterResponse {
   username: string
   JWToken: string
}

export interface LoginResponse extends RegisterResponse {
   favorites: string[]
}
