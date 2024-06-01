import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { checkJWT } from '../middlewares/jwtCheck.middleware'

const router = Router()

router.patch('/add', checkJWT, UserController.addFavoriteCountry)
router.patch('/remove', checkJWT, UserController.removeFavoriteCountry)

export default router
