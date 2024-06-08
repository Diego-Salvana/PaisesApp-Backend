import { body, param } from 'express-validator'
import { expressValidationResult } from './validation-results'

const registerValidator = [
   body('username', 'Username is required').trim().notEmpty(),
   body('email', 'Wrong email format').trim().isEmail().normalizeEmail(),
   body('password', 'Wrong password format').trim().isLength({ min: 6 }),
   expressValidationResult
]

const loginValidator = [
   body('email', 'Wrong email format').trim().isEmail().normalizeEmail(),
   body('password', 'Wrong password format').trim().isLength({ min: 6 }),
   expressValidationResult
]

const updateValidator = [
   body('username', 'Username cannot be empty').trim().isLength({ min: 1 }).optional(),
   body('email', 'Wrong email format').trim().isEmail().normalizeEmail().optional(),
   expressValidationResult
]

const cca3CodeValidator = [
   param('cca3Code', 'Wrong cca3Code format').trim().isLength({ min: 3, max: 3 }),
   expressValidationResult
]

export { registerValidator, loginValidator, updateValidator, cca3CodeValidator }
