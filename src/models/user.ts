/* eslint-disable @typescript-eslint/no-extraneous-class */
import { userMongo } from '../schema/User'
import { encrypt, verify } from '../utils/bcryptjs-handler'
import { generateToken } from '../utils/jwt-handler'
import { HttpError, ServerError } from '../utils/error-handler'
import { Auth, LoginResponse, RegisterResponse, User } from '../interfaces/user.interface'

export class UserModel {
   static async createUser (user: User): Promise<RegisterResponse> {
      const passwordHash = await encrypt(user.password)
      const userData = { ...user, password: passwordHash }
      let newUser

      try {
         newUser = await userMongo.create(userData)
      } catch (e: any) {
         console.log(e)

         if (e.code === 11000) throw new HttpError('AlreadyExists', 'Email already exists')

         throw new ServerError('Error creating user')
      }
   
      const JWToken = generateToken(newUser.email)
   
      return { username: newUser.username, JWToken }
   }
   
   static async loginUser ({ email, password }: Auth): Promise<LoginResponse> {
      let userResponse

      try {
         userResponse = await userMongo.findOne({ email })
      } catch (e) {
         console.log(e)
         throw new ServerError('Error login user')
      }

      if (userResponse === null) throw new HttpError('NotFound', 'User not found')
   
      const hashedPassword = userResponse.password
      const passwordIsCorrect = await verify(password, hashedPassword)

      if (!passwordIsCorrect) throw new HttpError('Unauthorized', 'Invalid password')
   
      const JWToken = generateToken(userResponse.email)
      const { username, favorites } = userResponse

      return { username, favorites, JWToken }
   }

   static async update (currentEmail: string, newEmail?: string, newUsername?: string): Promise<LoginResponse> {
      if (newEmail === undefined && newUsername === undefined) {
         throw new HttpError('BadRequest', 'Email or password must be provided')
      }

      let updateUserResult

      try {
         updateUserResult = await userMongo.findOneAndUpdate(
            { email: currentEmail }, { email: newEmail, username: newUsername }, { new: true }
         )
      } catch (e: any) {
         console.log(e)

         if (e.code === 11000) throw new HttpError('AlreadyExists', 'Email already exists')

         throw new ServerError('Error updating user')
      }

      if (updateUserResult === null) throw new HttpError('NotFound', 'User not found')

      const JWToken = generateToken(updateUserResult.email)
      const { username, favorites } = updateUserResult

      return { username, favorites, JWToken }
   }
   
   static async deleteUser (email: string): Promise<void> {
      let cleanUserResult

      try {
         cleanUserResult = await userMongo.deleteOne({ email })
      } catch (e) {
         console.log(e)
         throw new ServerError('Error deleting user')
      }

      if (cleanUserResult.deletedCount < 1) throw new HttpError('NotFound', 'User not found')
   }
   
   static async addFavorite (email: string, cca3Code: string): Promise<string[]> {
      let modifiedUser

      try {
         modifiedUser = await userMongo.findOneAndUpdate(
            { email }, { $addToSet: { favorites: cca3Code.toUpperCase() } }, { new: true }
         )
      } catch (e) {
         console.log(e)
         throw new ServerError('Error adding favorite')
      }

      if (modifiedUser === null) throw new HttpError('NotFound', 'User not found')
      
      return modifiedUser.favorites
   }
   
   static async removeFavorite (email: string, cca3Code: string): Promise<string[]> {
      let modifiedUser
      
      try {
         modifiedUser = await userMongo.findOneAndUpdate(
            { email }, { $pull: { favorites: cca3Code.toUpperCase() } }, { new: true }
         )
      } catch (e) {
         console.log(e)
         throw new ServerError('Error removing favorite')
      }
      
      if (modifiedUser === null) throw new HttpError('NotFound', 'User not found')
   
      return modifiedUser.favorites
   }
}
