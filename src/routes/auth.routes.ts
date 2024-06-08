import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { UserModel } from '../models/user'
import { refreshToken } from '../services/refresh-token'
import { checkJWT } from '../middlewares/jwt-check'
import { updateValidator, loginValidator, registerValidator } from '../middlewares/validator-chains'

const authRouter = (userModel: typeof UserModel): Router => {
   const router = Router()
   const userController = new UserController(userModel)

   router.post('/register', registerValidator, userController.register)
   router.post('/login', loginValidator, userController.login)
   router.patch('/update', updateValidator, checkJWT, userController.update)
   router.delete('/delete', checkJWT, userController.delete)
   router.get('/refresh', checkJWT, refreshToken)

   return router
}

export { authRouter }
