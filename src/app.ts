import 'dotenv/config'
import express from 'express'
import { dbConnection } from './database/dbConnection'
import { authRouter } from './routes/auth.routes'
import { favoriteRouter } from './routes/favorite.routes'
import { UserModel } from './models/user'
import { corsMiddleware } from './middlewares/cors'

void dbConnection()

const app = express()
app.use(express.json())
app.disable('x-powered-by')
app.use(corsMiddleware())

app.use('/auth', authRouter(UserModel))
app.use('/favorites', favoriteRouter(UserModel))

const PORT = process.env.PORT ?? 5000

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto: ${PORT} 🔥`))

export default app
