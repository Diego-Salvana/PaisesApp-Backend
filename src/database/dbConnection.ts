import mongoose from 'mongoose'

const dbConnection = async (): Promise<void> => {
   const DB_URI = process.env.MONGO_URI as string
   await mongoose.connect(DB_URI)
      .then(() => console.log('DB conectada 📖'))
      .catch((err) => {
         console.error(err)
         throw new Error('Error al iniciar DB')
      })
}

export { dbConnection }
