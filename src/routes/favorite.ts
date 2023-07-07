import { Router } from 'express';
import { addFavoriteCountry, removeFavoriteCountry } from '../controllers/favorite.controller';
import { checkJWT } from '../middlewares/jwtCheck.middleware';

const router = Router();

router.patch('/add', checkJWT, addFavoriteCountry);
router.patch('/remove', checkJWT, removeFavoriteCountry);

export default router;
