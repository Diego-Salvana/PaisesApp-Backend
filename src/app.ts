import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { dbConnection } from './database/dbConnection'
import authRouter from './routes/auth.routes'
import favoriteRouter from './routes/favorite.routes'

void dbConnection()

const app = express()
app.use(cors())
app.use(express.json())
app.disable('x-powered-by')

app.use('/auth', authRouter)
app.use('/favorites', favoriteRouter)

const PORT = process.env.PORT ?? 5000

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto: ${PORT} 🔥`))

export default app
