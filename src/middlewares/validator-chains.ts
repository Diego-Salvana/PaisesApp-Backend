import { body } from 'express-validator'
import { expressValidationResult } from './validation-results'

const registerValidator = [
   body('username', 'Userame is required').trim().notEmpty(),
   body('email', 'Wrong email format').trim().isEmail().normalizeEmail(),
   body('password', 'Wrong password format').trim().isLength({ min: 6 }),
   expressValidationResult
]

const loginValidator = [
   body('email', 'Wrong email format').trim().isEmail().normalizeEmail(),
   body('password', 'Wrong password format').trim().isLength({ min: 6 }),
   expressValidationResult
]

export { registerValidator, loginValidator }
