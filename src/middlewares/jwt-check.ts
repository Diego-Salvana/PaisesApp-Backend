import { NextFunction, Response } from 'express'
import { verifyToken } from '../utils/jwt-handler'
import { RequestExt } from '../interfaces/request-ext.interface'

const checkJWT = (req: RequestExt, res: Response, next: NextFunction): Response | undefined => {
   try {
      const token = req.headers.authorization?.split(' ').pop() ?? ''
      const jwtPayload = verifyToken(token)
      
      req.userPayload = jwtPayload

      next()
   } catch (e: any) {
      console.log(e)

      if (e.name === 'JsonWebTokenError') {
         return res.status(401).send({ errorType: e.name, message: e.message })
      }

      return res.status(500).send({ errorType: 'ServerError', message: e.message })
   }
}

export { checkJWT }
