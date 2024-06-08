type RequestError = 'NotFound' | 'AlreadyExists' | 'Unauthorized' | 'BadRequest'

export class HttpError extends Error {
   readonly name = 'HttpError'
   readonly type: RequestError
   readonly statusCode: number

   constructor (type: RequestError, message: string) {
      super(message)
      this.type = type
      this.statusCode = this.setCode(type)
   }

   private setCode (type: RequestError): number {
      switch (type) {
         case 'Unauthorized':
            return 401
         case 'NotFound':
            return 404
         case 'AlreadyExists':
            return 409
         default:
            return 400
      }
   }
}

export class ServerError extends Error {
   readonly name = 'ServerError'
}

export class CorsError extends Error {
   readonly name = 'CorsError'

   constructor (message: string) {
      super(message)
      this.stack = undefined
   }
}
