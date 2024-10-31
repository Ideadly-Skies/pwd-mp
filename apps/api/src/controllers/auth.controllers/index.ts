import { Request, Response, NextFunction } from "express"
import { comparePassword, hashPassword } from "@/utils/hash.password"
import { registerUserService } from "@/services/auth.services"

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