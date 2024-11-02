import { Request, Response, NextFunction } from "express"
import { comparePassword, hashPassword } from "@/utils/hash.password"
import { loginOrganizerService, loginUserService, registerUserService, registerOrganizerService } from "@/services/auth.services"
import { createToken } from "@/utils/jwt"

export const registerUser = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, username, password } = req.body

        if(!firstName ||!lastName || !email || !username || !password) throw {msg: 'Input cannot be blank',status: 406}

        const date = `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()}`
        const id = Date.now()

        const referralCode = `KMPLIN-${id}-${date}`

        const hashedPassword = await hashPassword(password)

        await registerUserService({firstName, lastName, email, username, password: hashedPassword, referralCode: referralCode})
        res.status(201).json({
            error: false,
            message: 'user created',
            data: {
                name: firstName,lastName,
                username: username,
                email: email,
                referralCode: referralCode
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
            message: 'user created',
            data: {
                name: firstName,lastName,
                username: username,
                email: email,
                companyName: companyName,
                phoneNumber: phoneNumber,
                pic: pic
            }
        })
    } catch (error) {
        // console.log(error)
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
                name: `${user.firstName} ${user.lastName}`,
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
                name: `${organizer.firstName} ${organizer.lastName}`,
                profilePicture: organizer.pic,
            },
        });
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
    } catch (error) {
        
    }
}

