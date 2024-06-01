import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { dbConnection } from './database/dbConnection'
import authRouter from './routes/auth'
import favoriteRouter from './routes/favorite'

const PORT = process.env.PORT ?? 5000

const app = express()

dbConnection()
   .then(() => console.log('DB conectada 📖'))
   .catch((err) => {
      console.error(err)
      throw new Error('Error al iniciar DB')
   })

app.use(cors())
app.use(express.json())

app.use('/auth', authRouter)
app.use('/favorites', favoriteRouter)

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto: ${PORT} 🔥`))

export default app
