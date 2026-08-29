
import { betterAuth } from "better-auth" 
import { prismaAdapter } from "better-auth/adapters/prisma"
import db from "./db"


export const auth = betterAuth({

    baseURL: process.env.BETTER_AUTH_URL, 

    database: 
            prismaAdapter(db , {
                provider: "postgresql"
            })
    ,
    emailAndPassword: {
        enabled: true ,
    }, 
}) ;