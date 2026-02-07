import {z} from "zod"

export const TeamSchema = z.object({
    name: z.string().min(2 , "Team name is Short"),
    ownerId: z.number().int() //Admin User
})

export type Team = z.infer<typeof TeamSchema>