/* eslint-disable @typescript-eslint/no-extraneous-class */
import { userMongo } from '../schema/User'
import { encrypt, verify } from '../utils/bcryptjs.handle'
import { generateToken } from '../utils/jwt.handle'
import { Auth, User } from '../interfaces/user.interface'

export class UserModel {
   static createUser = async (user: User) => {
      const passwordHash = await encrypt(user.password)
      const registerUser = { ...user, password: passwordHash }
   
      const { username, email } = await userMongo.create(registerUser)
   
      const JWToken = generateToken(email)
   
      return { username, JWToken }
   }
   
   static loginUser = async ({ email, password }: Auth) => {
      const user = await userMongo.findOne({ email })
      if (user === null) return 'USER_NOT_FOUND'
   
      const passwordHash = user.password
      const passwordIsCorrect = await verify(password, passwordHash)
      if (!passwordIsCorrect) return 'INCORRECT_PASSWORD'
   
      const JWToken = generateToken(user.email)
   
      const { username, favorites } = user
      return { username, favorites, JWToken }
   }
   
   static deleteUser = async (email: string) => {
      const cleanUserResult = await userMongo.deleteOne({ email })
      if (cleanUserResult.deletedCount === 0) return 'USER_NOT_FOUND'
   
      return cleanUserResult
   }
   
   static addOneFavorite = async (email: string, cca3Code: string) => {
      const user = await userMongo.findOne({ email })
      if (user === null) return 'USER_NOT_FOUND'
      if (user.favorites.includes(cca3Code)) return 'FAVORITE_ALREADY_EXISTS'
   
      user.favorites.push(cca3Code)
   
      const modifiedUser = await userMongo.findOneAndUpdate(
         { email: user.email },
         { favorites: user.favorites },
         { new: true }
      )
   
      return modifiedUser?.favorites
   }
   
   static removeFavorite = async (email: string, cca3Code: string) => {
      const user = await userMongo.findOne({ email })
      if (user === null) return 'USER_NOT_FOUND'
   
      const updatedFavorites = user.favorites.filter((code) => code !== cca3Code)
   
      const modifiedUser = await userMongo.findOneAndUpdate(
         { email: user.email },
         { favorites: updatedFavorites },
         { new: true }
      )
   
      return modifiedUser?.favorites
   }
   
   static refreshToken = async (email: string) => {
      const user = await userMongo.findOne({ email })
      if (user === null) return 'USER_NOT_FOUND'
   
      const JWToken = generateToken(user.email)
   
      const { username, favorites } = user
      return { username, favorites, JWToken }
   }
}
