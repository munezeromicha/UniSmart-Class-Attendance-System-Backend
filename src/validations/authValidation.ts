import { body } from 'express-validator';
import { UserRole } from '../models/User';

export const registerValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  body('token')
    .notEmpty()
    .withMessage('Invitation token is required'),

  body('registrationNumber')
    .if(body('role').equals(UserRole.STUDENT))
    .notEmpty()
    .withMessage('Registration number is required for students')
    .matches(/^\d{4}\/BSC\/[A-Z]+\/\d{3}$/)
    .withMessage('Invalid registration number format. Use format: YYYY/BSC/DEPT/XXX')
];

export const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];