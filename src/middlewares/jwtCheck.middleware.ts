import { NextFunction, Response } from 'express';
import { verifyToken } from '../utils/jwt.handle';
import { RequestExt } from '../interfaces/RequestExt.interface';

const checkJWT = async (req: RequestExt, res: Response, next: NextFunction) => {
   try {
      const token = req.headers.authorization?.split(' ').pop() || '';
      const jwtPayload = verifyToken(token);
      
      req.userPayload = jwtPayload;

      next();
   } catch (err: any) {
      console.log(err);
      res.status(401).send({ error: 'INVALID_SESSION', message: err.message });
   }
};

export { checkJWT };
