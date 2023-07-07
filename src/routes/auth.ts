import { Router } from 'express';
import { loginCtrl, registerCtrl, deleteCtrl, refreshTokenCtrl } from '../controllers/auth.controller';
import { checkJWT } from '../middlewares/jwtCheck.middleware';
import { loginValidator, registerValidator } from '../middlewares/authValidation.middleware';

const router = Router();

router.post('/register', registerValidator, registerCtrl);
router.post('/login', loginValidator, loginCtrl);
router.delete('/delete', checkJWT, deleteCtrl);
router.get('/refresh', checkJWT, refreshTokenCtrl);

export default router;
