import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { UserModel } from '../models/user'
import { RequestExt } from '../interfaces/RequestExt.interface'

export class UserController {
   static async register ({ body }: Request, res: Response): Promise<void> {
      try {
         const newUser = await UserModel.createUser(body)
         res.status(201).send(newUser)
      } catch (err: any) {
         console.log('Auth Controller:', err)
         if (err.code === 11000) {
            res.status(400).send('USER_EMAIL_ALREADY_EXISTS')
         } else {
            res.status(500).send('SERVER_ERROR')
         }
      }
   }
   
   static login = async ({ body }: Request, res: Response): Promise<void> => {
      console.log(body)
      try {
         const responseUser = await UserModel.loginUser(body)
   
         if (responseUser === 'USER_NOT_FOUND' || responseUser === 'INCORRECT_PASSWORD') {
            res.status(400).send(responseUser)
         } else {
            res.status(200).send(responseUser)
         }
      } catch (err) {
         console.error(err)
         res.status(500).send('SERVER_ERROR')
      }
   }
   
   static delete = async ({ userPayload }: RequestExt, res: Response): Promise<void> => {
      try {
         const payload = userPayload as JwtPayload
         const deleteResult = await UserModel.deleteUser(payload.email)
   
         if (deleteResult === 'USER_NOT_FOUND') res.send(deleteResult)
         else res.status(200).send(deleteResult)
      } catch (err) {
         console.error(err)
         res.status(500).send('SERVER_ERROR')
      }
   }
   
   static refreshToken = async ({ userPayload }: RequestExt, res: Response) => {
      try {
         const payload = userPayload as JwtPayload
         const responseUser = await UserModel.refreshToken(payload.email)
   
         if (responseUser === 'USER_NOT_FOUND') { return res.status(401).send({ error: 'UNAUTHORIZED', message: 'User not found.' }) }
   
         res.status(200).send(responseUser)
      } catch (err) {
         console.error(err)
         res.status(500).send('SERVER_ERROR')
      }
   }

   static addFavoriteCountry = async ({ body, userPayload }: RequestExt, res: Response) => {
      try {
         const payload = userPayload as JwtPayload
         const updatedFavorites = await UserModel.addOneFavorite(payload.email, body.cca3Code)
   
         if (updatedFavorites === 'USER_NOT_FOUND' || updatedFavorites === 'FAVORITE_ALREADY_EXISTS') { return res.status(400).send({ error: updatedFavorites }) }
   
         res.status(200).send({ updatedFavorites })
      } catch (err) {
         console.log(err)
         res.status(500).send(err)
      }
   }
   
   static removeFavoriteCountry = async ({ body, userPayload }: RequestExt, res: Response) => {
      try {
         const payload = userPayload as JwtPayload
         const updatedFavorites = await UserModel.removeFavorite(payload.email, body.cca3Code)
   
         if (updatedFavorites === 'USER_NOT_FOUND') return res.status(400).send({ error: updatedFavorites })
   
         res.status(200).send({ updatedFavorites })
      } catch (err) {
         console.log(err)
         res.status(500).send(err)
      }
   }
}
