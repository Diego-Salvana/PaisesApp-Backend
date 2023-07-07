import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

const expressValidationResult = (req: Request, res: Response, next: NextFunction) => {
   try {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) throw validationErrors;

      next();
   } catch (error) {
      console.log(error);
      res.status(400).send(error);
   }
};

export { expressValidationResult };
