import { Router } from "express";
import { loginOrganizer, loginUser, registerOrganizer, registerUser } from "@/controllers/auth.controllers";
import { loginOrganizerValidator, loginValidator, registerOrganizerValidator, registerUserValidator } from "@/middlewares/validator/auth.validator";
import { errorHandling } from "@/middlewares/validator/error.handling";

const router = Router()

router.post('/register',registerUserValidator,errorHandling, registerUser)
router.post('/login-user',loginValidator,errorHandling, loginUser)
router.post('/register-organizer',registerOrganizerValidator,errorHandling, registerOrganizer)
router.post('/login-organizer',loginOrganizerValidator,errorHandling, loginOrganizer)

export default router