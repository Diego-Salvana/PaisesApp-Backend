import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { checkJWT } from '../middlewares/jwtCheck.middleware'
import { loginValidator, registerValidator } from '../middlewares/validator-chains'

const router = Router()

router.post('/register', registerValidator, UserController.register)
router.post('/login', loginValidator, UserController.login)
router.delete('/delete', checkJWT, UserController.delete)
router.get('/refresh', checkJWT, UserController.refreshToken)

export default router
