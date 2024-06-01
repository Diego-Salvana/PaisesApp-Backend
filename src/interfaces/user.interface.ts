export interface Auth {
   email: string
   password: string
}

export interface User extends Auth {
   id: any
   username: string
   favorites?: string[]
}
