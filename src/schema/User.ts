import { Schema, model } from 'mongoose'

const userSchema = new Schema(
   {
      username: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      favorites: { type: Array }
   },
   { timestamps: true }
)

export const userMongo = model('user', userSchema)
