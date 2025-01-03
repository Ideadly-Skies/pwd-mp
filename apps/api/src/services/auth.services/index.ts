import { prisma } from "@/connection";
import { IRegisterOrganizer, IRegisterUser } from "./types";
import { hashPassword } from "@/utils/hash.password";
import { comparePassword } from "@/utils/hash.password";
import { createToken } from "@/utils/jwt";
import fs from 'fs';
import { transporter } from "@/utils/transporter";
import { compile } from "handlebars";

export const registerUserService = async({firstName, lastName, email, username, password, referralCode, newReferralCode}: IRegisterUser) => {
    await prisma.$transaction( async (prisma) => {
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                username,
                password,
                referralCode: newReferralCode
            }
        })
    
        if(referralCode){
            const referrer = await prisma.user.findUnique({
                where: {
                    referralCode
                }
            })
            console.log('Referrer:',referrer)
    
            if(referrer){
                await prisma.referralPoint.create({
                    data: {
                        point: 10000,
                        expiry: new Date(new Date().setMonth(new Date().getMonth() + 3)),
                        userId: referrer.id
                    }  
                })
    
                await prisma.user.update({
                    where: {
                        referralCode
                    },
                    data: {
                        totalPoint: {
                            increment:10000
                        }
                    }
                })
    
                await prisma.referralDiscount.create({
                    data: {
                        userId: user.id,
                        discount: 0.1,
                        expiry: new Date(new Date().setMonth(new Date().getMonth() + 3))
                    }
                })
            }
        }
    })
}

export const registerOrganizerService = async({firstName, lastName, email, username, password: hashedPassword, companyName, phoneNumber, pic}: IRegisterOrganizer) => {
    await prisma.eventOrganizer.create({
        data: {
            firstName, 
            lastName, 
            email, 
            username, 
            password: hashedPassword, 
            companyName, 
            phoneNumber, 
            pic
        }
    })
}

export const loginUserService = async (emailOrUsername: string) => {
    // Create the query object based on the input
    const where: { email?: string; username?: string } = {};

    // Determine if the input is an email or username
    if (emailOrUsername.includes('@')) {
        where.email = emailOrUsername; // If it's an email
    } else {
        where.username = emailOrUsername; // Otherwise, treat it as a username
    }

    // Use the constructed where object in the findUnique call
    return await prisma.user.findFirst({
        where: where as any, // Cast as any for TypeScript
    });
};

export const loginOrganizerService = async (emailOrUsername: string) => {
    // Create the query object based on the input
    const where: { email?: string; username?: string } = {};

    // Determine if the input is an email or username
    if (emailOrUsername.includes('@')) {
        where.email = emailOrUsername; // If it's an email
    } else {
        where.username = emailOrUsername; // Otherwise, treat it as a username
    }

    // Use the constructed where object in the findUnique call
    return await prisma.eventOrganizer.findFirst({
        where: where as any, // Cast as any for TypeScript
    });
};

export const resetPasswordService = async({id, password, token}: any) => {
    const findUser = await prisma.user.findUnique({
        where: {
            id,
            resetPasswordToken: token
        }
    })

    if(!findUser?.id) throw {msg: 'Link expired, please request another one', status: 406}

    await prisma.user.update({
        data: {
            password: await hashPassword(password),
            resetPasswordToken: null
        },
        where: {
            id
        }
    })
}

export const keepLoginService = async ({ id }: any) => {
    // Check in the user table first
    const findUser = await prisma.user.findUnique({
        where: { id },
    });

    if (findUser) return findUser;

    // If not found in user table, check in the eventOrganizer table
    const findEventOrganizer = await prisma.eventOrganizer.findUnique({
        where: { id },
    });

    if (!findEventOrganizer) throw { msg: 'User Tidak Ditemukan', status: 400 };

    return findEventOrganizer;
};

export const requestVerifyAccountService = async({id}:any) => {
   const user = await prisma.user.findUnique({
        where: {
            id: id
        },
        select: {
            email: true,
            id: true,
            role: true,
            firstName: true,
            lastName: true
        }
    })

    const verifyAccountToken = await createToken({id: user?.id, role: user?.role})

    await prisma.user.update({
        where: {
            id: id
        },
        data: {
            resetPasswordToken: verifyAccountToken
        }
    })

        const resetUrl = `http://localhost:3000/verify-account/${verifyAccountToken}`;
        const emailTemplate = fs.readFileSync('./src/public/verify.email.form.html', 'utf-8');
        const compiledTemplate = await compile(emailTemplate);
        const personalizedEmailBody = compiledTemplate({
            firstName: user!.firstName,
            email: user!.email,
            url: resetUrl,
        });
    
         // Step 4: Send the email
         await transporter.sendMail({
            to: user!.email,
            subject: 'Reset Your Password',
            html: personalizedEmailBody,
        });
}

export const verifyAccountService = async({id}: any) => {

    const findUser = await prisma.user.findUnique({
        where: {
            id
        }
    })
 
    if(!findUser?.id && findUser!.resetPasswordToken?.length === 0) throw {msg: 'Link expired, please request another one', status: 406}

    await prisma.user.update({
        data: {
            isValid: true,
            resetPasswordToken: null
        },
        where: {
            id
        }
    })
}

export const changeUserPasswordService = async({usersId, oldPassword, password}: any) => {
    
    const user = await prisma.user.findUnique({
        where: {
            id: usersId
        }
    })

    const isComparePassword = await comparePassword(oldPassword, user!.password);
    if (!isComparePassword) throw { msg: 'False password, please try again', status: 406 };

    await prisma.user.update({
        where: {
            id: usersId
        },
        data: {
            password: await hashPassword(password)
        }
    })
}

export const changeOrganizerPasswordService = async({usersId, oldPassword, password}: any) => {
    const organizer = await prisma.eventOrganizer.findUnique({
        where: {
            id: usersId
        }
    })

    const isComparePassword = await comparePassword(oldPassword, organizer!.password);
    if (!isComparePassword) throw { msg: 'False password, please try again', status: 406 };

    await prisma.eventOrganizer.update({
        where: {
            id: usersId
        },
        data: {
            password: await hashPassword(password)
        }
    })
}

