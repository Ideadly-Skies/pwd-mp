import { Request, Response, NextFunction } from "express";
import { comparePassword, hashPassword } from "@/utils/hash.password";
import { loginOrganizerService, loginUserService, registerUserService, registerOrganizerService, resetPasswordService, keepLoginService, requestVerifyAccountService, verifyAccountService, changeUserPasswordService, changeOrganizerPasswordService } from "@/services/auth.services";
import { createToken } from "@/utils/jwt";
import fs from 'fs';
import {compile} from 'handlebars'
import prisma from "@/prisma";
import { transporter } from "@/utils/transporter";
import { IUser } from "./types";

export const registerUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("called")
        console.log(req.body);

        const { firstName, lastName, email, username, password, referralCode } = req.body
        console.log(req.body)

        if(!firstName ||!lastName || !email || !username || !password) throw {msg: 'Input cannot be blank',status: 406}

        if (referralCode) {
            const referrer = await prisma.user.findUnique({
                where: {
                    referralCode: referralCode
                }
            });

            if (!referrer) {
                return res.status(400).json({
                    error: true,
                    message: 'Invalid referral code. Please check and try again.'
                });
            }
        }

        const date = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()}`
        const id = Date.now()

        const newReferralCode = `KMPLIN-${id}-${date}`

        const hashedPassword = await hashPassword(password)

        await registerUserService({firstName, lastName, email, username, password: hashedPassword, referralCode, newReferralCode})

        res.status(201).json({
            error: false,
            message: 'Successfully registered',
            data: {
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                referralCode: newReferralCode
            }
        })
    } catch (error) {
        // console.log(error)
        next(error)
    }
}

export const registerOrganizer = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, username, password, companyName, phoneNumber, pic } = req.body

        if(!firstName ||!lastName || !email || !username || !password) throw {msg: 'Input cannot be blank',status: 406}

        const hashedPassword = await hashPassword(password)

        await registerOrganizerService({firstName, lastName, email, username, password: hashedPassword, companyName, phoneNumber, pic })
        res.status(201).json({
            error: false,
            message: 'Successfully registered as Organizer',
            data: {
                firstName: firstName,
                lastName: lastName,
                username: username,
                email: email,
                companyName: companyName,
                phoneNumber: phoneNumber,
                pic: pic
            }
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}


export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { emailOrUsername, password } = req.body; // Input can be email or username
        if (!emailOrUsername || !password) throw { msg: 'Input cannot be blank', status: 406 };

        const user = await loginUserService(emailOrUsername); // Pass the emailOrUsername directly
        if (!user) throw { msg: 'Error, user not found', status: 406 };

        const isComparePassword = await comparePassword(password, user.password);
        if (!isComparePassword) throw { msg: 'False password, please try again', status: 406 };

        // Create token
        const token = await createToken({id:user.id, role: user.role});

        res.status(200).json({
            error: false,
            message: 'Welcome',
            data: {
                token,
                email: user.email, // Ensure you're sending the user's email
                firstName: user.firstName,
                lastName: user.lastName,
                profilePicture: user.profilePictureUrl,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const loginOrganizer = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { emailOrUsername, password } = req.body; // Input can be email or username
        if (!emailOrUsername || !password) throw { msg: 'Input cannot be blank', status: 406 };

        const organizer = await loginOrganizerService(emailOrUsername); // Pass the emailOrUsername directly
        if (!organizer) throw { msg: 'Error, user not found', status: 406 };

        const isComparePassword = await comparePassword(password, organizer.password);
        if (!isComparePassword) throw { msg: 'False password, please try again', status: 406 };

        // Create token
        const token = await createToken({id: organizer.id, role: organizer.role});

        res.status(200).json({
            error: false,
            message: 'Welcome',
            data: {
                token,
                email: organizer.email, // Ensure you're sending the organizer's email
                firstName: organizer.firstName,
                lastName: organizer.lastName,
                profilePicture: organizer.pic,
            },
        });
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        // Step 1: Find the user by email and get name details
        const user = await prisma.user.findUnique({
            where: { email },
            select: { firstName: true, lastName: true, email: true , id: true, role: true},
        });
        if (!user) throw { msg: 'Invalid email, please try with a valid email', status: 406 };

        // Step 2: Generate a secure reset token and expiration
        // const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordToken = await createToken({id: user.id, role: user.role})

        // Hash the token and store it in the database
        await prisma.user.update({
            where: { email },
            data: {
                resetPasswordToken: resetPasswordToken
            },
        });

        // Step 3: Prepare the reset URL and email body
        const resetUrl = `http://localhost:3000/reset-password/${resetPasswordToken}`;
        const emailTemplate = fs.readFileSync('./src/public/reset.password.form.html', 'utf-8');
        const compiledTemplate = await compile(emailTemplate);
        const personalizedEmailBody = compiledTemplate({
            firstName: user.firstName,
            email: user.email,
            url: resetUrl,
        });

        // Step 4: Send the email
        await transporter.sendMail({
            to: user.email,
            subject: 'Reset Your Password',
            html: personalizedEmailBody,
        });

        res.status(200).json({ 
            error: false,
            message: 'Password reset link sent to your email',
            data: resetPasswordToken
        });
       
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const verifyResetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {usersId, password} = req.body
        const {authorization} = req.headers 

        await resetPasswordService({id: usersId, password, token: authorization?.split(' ')[1]!})

        res.status(200).json({
            error: false, 
            message: 'Reset Password Success',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

export const keepLogin = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {usersId} = req.body 
        
        const user: any = await keepLoginService({id: usersId})
        // console.log(user)
        
        res.status(200).json({
            error: false, 
            message: 'Keep Auth Success', 
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role, 
                email: user.email,
                profilePictureUrl: user.profilePictureUrl
            }
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const requestVerifyAccount = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {usersId} = req.body

        await requestVerifyAccountService({id: usersId})

        res.status(200).json({
            error: false,
            message: 'Account verification request sended, please check your email',
            data: {}
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const verifyAccount = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {usersId} = req.body
        console.log(usersId)

        await verifyAccountService({id: usersId})

    res.status(200).json({
        error: false,
        message: 'Your account is now verified',
        data: {}
    })    
    } catch (error) {
        next(error)
    }
}

export const changeUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {usersId, oldPassword, password} = req.body 


        await changeUserPasswordService({usersId, oldPassword, password})

        res.status(200).json({
            error: false,
            message: 'Password successfully changed'
        })
    } catch (error) {
        next(error)
    }
}

export const changeOrganizerPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {usersId, oldPassword, password} = req.body
        
        await changeOrganizerPasswordService({usersId, oldPassword, password})

        
    } catch (error) {
        next(error)
    }
}

