import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

const expressValidationResult = (req: Request, res: Response, next: NextFunction): void => {
   try {
      const validationErrors = validationResult(req)

      validationErrors.throw()

      next()
   } catch (e) {
      console.log(e)
      
      // TODO: controlar el error
      res.status(400).send(e)
   }
}

export { expressValidationResult }
