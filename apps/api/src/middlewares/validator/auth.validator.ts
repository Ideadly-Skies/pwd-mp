import { body } from "express-validator";

export const registerUserValidator = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
  
  export const loginValidator = [
    body('emailOrUsername').notEmpty().withMessage('Email or username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ];
  
  export const registerOrganizerValidator = [
    ...registerUserValidator,
    body('companyName').notEmpty().withMessage('Company name is required'),
    body('phoneNumber').isMobilePhone('any').withMessage('Invalid phone number'),
    body('pic').optional().isURL().withMessage('Invalid URL for profile picture'),
  ];

  export const loginOrganizerValidator = loginValidator;