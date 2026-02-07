import {z} from "zod"


export const UserSchema = z.object({
    name : z.string().min(3).max(20),
    role : z.enum(["ADMIN","EMPLOYEE"]).optional(),
    password: z.string().min(8),
    email: z.string().email("invalid email"),
    teamId: z.number().int().optional(),
    createAt : z.date(),
})

export type User = z.infer<typeof UserSchema>