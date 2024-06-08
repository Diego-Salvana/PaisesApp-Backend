import { Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { userMongo } from '../schema/User'
import { generateToken } from '../utils/jwt-handler'
import { HttpError, ServerError } from '../utils/error-handler'
import { RequestExt } from '../interfaces/request-ext.interface'
import { LoginResponse } from '../interfaces/user.interface'

const updateToken = async (email: string): Promise<LoginResponse> => {
   let user

   try {
      user = await userMongo.findOne({ email })
   } catch (e) {
      console.log(e)
      throw new ServerError('Error updating token')
   }

   if (user === null) throw new HttpError('NotFound', 'User not found')

   const JWToken = generateToken(user.email)
   const { username, favorites } = user

   return { username, favorites, JWToken }
}

export const refreshToken = async ({ userPayload }: RequestExt, res: Response): Promise<Response> => {
   const payload = userPayload as JwtPayload
   
   try {
      const responseUser = await updateToken(payload.email)

      return res.status(200).send(responseUser)
   } catch (e: any) {
      if (e instanceof HttpError) {
         return res.status(e.statusCode).send({ errorType: e.name, message: e.message })
      }

      return res.status(500).send({ errorType: e.name, message: e.message })
   }
}
