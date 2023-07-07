import { body } from 'express-validator';
import { expressValidationResult } from './validationResult.middleware';

const registerValidator = [
   body('username', 'Userame is required').trim().isLength({ min: 1 }),
   body('email', 'Wrong email format').trim().isEmail().normalizeEmail(),
   body('password', 'Wrong password format').trim().isLength({ min: 6 }),
   expressValidationResult,
];

const loginValidator = [
   body('email', 'Wrong email format').trim().isEmail().normalizeEmail(),
   body('password', 'Wrong password format').trim().isLength({ min: 6 }),
   expressValidationResult,
];

export { registerValidator, loginValidator };
