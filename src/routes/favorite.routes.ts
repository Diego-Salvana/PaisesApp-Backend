import { Router } from 'express'
import { UserController } from '../controllers/user.controller'
import { UserModel } from '../models/user'
import { checkJWT } from '../middlewares/jwt-check'
import { cca3CodeValidator } from '../middlewares/validator-chains'

const favoriteRouter = (userModel: typeof UserModel): Router => {
   const router = Router()
   const userController = new UserController(userModel)

   router.patch('/add/:cca3Code', cca3CodeValidator, checkJWT, userController.addFavoriteCountry)
   router.patch('/remove/:cca3Code', cca3CodeValidator, checkJWT, userController.removeFavoriteCountry)

   return router
}

export { favoriteRouter }
