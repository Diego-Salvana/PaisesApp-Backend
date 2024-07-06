/* eslint-disable @typescript-eslint/no-extraneous-class */
import { userMongo } from '../schema/User'
import { encrypt, verify } from '../utils/bcryptjs-handler'
import { generateToken } from '../utils/jwt-handler'
import { HttpError, ServerError } from '../utils/error-handler'
import { Auth, LoginResponse, RegisterResponse, UpdateUser, User } from '../interfaces/user.interface'

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

   static async update (email: string, { newUsername, password, newPassword }: UpdateUser): Promise<LoginResponse> {
      if (newUsername === undefined && password === undefined && newPassword === undefined) {
         throw new HttpError('BadRequest', 'Username or password must be provided')
      }

      const userData: UpdateUser = { newUsername }
      
      if (password !== undefined || newPassword !== undefined) {
         let currentUser
         
         try {
            currentUser = await userMongo.findOne({ email })
         } catch (e) {
            console.log(e)
            throw new ServerError('Error login user')
         }

         if (currentUser === null) throw new HttpError('NotFound', 'User not found')

         const hashedPassword = currentUser.password
         const passwordIsCorrect = await verify(password ?? '', hashedPassword)

         if (!passwordIsCorrect) throw new HttpError('Unauthorized', 'Invalid password')
         if (newPassword === undefined) throw new HttpError('BadRequest', 'New password is required')

         const newPasswordHash = await encrypt(newPassword)
         userData.newPassword = newPasswordHash
      }

      let updatedUser

      try {
         updatedUser = await userMongo.findOneAndUpdate(
            { email },
            { username: userData.newUsername, password: userData.newPassword },
            { new: true }
         )
      } catch (e: any) {
         console.log(e)

         throw new ServerError('Error updating user')
      }

      if (updatedUser === null) throw new HttpError('NotFound', 'User not found')

      const JWToken = generateToken(updatedUser.email)
      const { username, favorites } = updatedUser

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
