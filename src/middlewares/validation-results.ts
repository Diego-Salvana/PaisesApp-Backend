import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

const expressValidationResult = (req: Request, res: Response, next: NextFunction): Response | undefined => {
   try {
      const validationErrors = validationResult(req)

      validationErrors.throw()

      next()
   } catch (e: any) {
      console.log(e)

      if (e.errors !== undefined) return res.status(400).send({ errors: e.errors })
      
      return res.status(500).send({ errorType: 'ServerError', message: e.message })
   }
}

export { expressValidationResult }
