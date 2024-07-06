import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { UserModel } from '../models/user'
import { RequestExt } from '../interfaces/request-ext.interface'
import { HttpError } from '../utils/error-handler'

export class UserController {
   private readonly userModel: typeof UserModel

   constructor (userModel: typeof UserModel) {
      this.userModel = userModel
   }

   register = async ({ body }: Request, res: Response): Promise<Response> => {
      const { username, email, password } = body
      const userData = { username, email, password }

      try {
         const newUser = await this.userModel.createUser(userData)

         return res.status(201).send(newUser)
      } catch (e: any) {
         if (e instanceof HttpError) {
            return res.status(e.statusCode).send({ errorType: e.name, message: e.message })
         }

         return res.status(500).send({ errorType: e.name, message: e.message })
      }
   }
   
   login = async ({ body }: Request, res: Response): Promise<Response> => {
      const { email, password } = body
      const user = { email, password }

      try {
         const responseUser = await this.userModel.loginUser(user)
   
         return res.status(200).send(responseUser)
      } catch (e: any) {
         if (e instanceof HttpError) {
            return res.status(e.statusCode).send({ errorType: e.name, message: e.message })
         }

         return res.status(500).send({ errorType: e.name, message: e.message })
      }
   }

   update = async ({ userPayload, body }: RequestExt, res: Response): Promise<Response> => {
      const payload = userPayload as JwtPayload
      const { newUsername, password, newPassword } = body

      try {
         const updatedUser = await this.userModel.update(payload.email, { newUsername, password, newPassword })

         return res.status(200).send(updatedUser)
      } catch (e: any) {
         if (e instanceof HttpError) {
            return res.status(e.statusCode).send({ errorType: e.name, message: e.message })
         }

         return res.status(500).send({ errorType: e.name, message: e.message })
      }
   }
   
   delete = async ({ userPayload }: RequestExt, res: Response): Promise<Response> => {
      const payload = userPayload as JwtPayload

      try {
         await this.userModel.deleteUser(payload.email)
   
         return res.status(200).send({ message: 'The user has been removed' })
      } catch (e: any) {
         if (e instanceof HttpError) {
            return res.status(e.statusCode).send({ errorType: e.name, message: e.message })
         }

         return res.status(500).send({ errorType: e.name, message: e.message })
      }
   }

   addFavoriteCountry = async ({ userPayload, params }: RequestExt, res: Response): Promise<Response> => {
      const payload = userPayload as JwtPayload

      try {
         const updatedFavorites = await this.userModel.addFavorite(payload.email, params.cca3Code)
   
         return res.status(200).send({ updatedFavorites })
      } catch (e: any) {
         if (e instanceof HttpError) {
            return res.status(e.statusCode).send({ errorType: e.name, message: e.message })
         }

         return res.status(500).send({ errorType: e.name, message: e.message })
      }
   }
   
   removeFavoriteCountry = async ({ userPayload, params }: RequestExt, res: Response): Promise<Response> => {
      const payload = userPayload as JwtPayload

      try {
         const updatedFavorites = await this.userModel.removeFavorite(payload.email, params.cca3Code)
   
         return res.status(200).send({ updatedFavorites })
      } catch (e: any) {
         if (e instanceof HttpError) {
            return res.status(e.statusCode).send({ errorType: e.name, message: e.message })
         }

         return res.status(500).send({ errorType: e.name, message: e.message })
      }
   }
}
