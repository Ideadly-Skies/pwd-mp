import { Router } from "express";
import { keepLogin, loginOrganizer, loginUser, registerOrganizer, registerUser, resetPassword, verifyResetPassword, requestVerifyAccount, verifyAccount } from "@/controllers/auth.controllers";
import { loginOrganizerValidator, loginValidator, registerOrganizerValidator, registerUserValidator } from "@/middlewares/validator/auth.validator";
import { errorHandling } from "@/middlewares/validator/error.handling";
import { verifyRole } from "@/middlewares/verify.role";
import { verifyToken } from "@/middlewares/verify.token";

const router = Router()

router.post('/register', registerUserValidator, errorHandling, registerUser)
router.post('/login-user', loginValidator, errorHandling, loginUser)
router.post('/register-organizer', registerOrganizerValidator, errorHandling, registerOrganizer)
router.post('/login-organizer', loginOrganizerValidator, errorHandling, loginOrganizer)
router.post('/request-password-reset', resetPassword);
router.post('/reset-password', verifyToken, verifyResetPassword)
router.get('/', verifyToken, keepLogin)
router.post('/request-verify-account', verifyToken, requestVerifyAccount)
router.patch('/verify-account', verifyToken, verifyAccount)

export default router