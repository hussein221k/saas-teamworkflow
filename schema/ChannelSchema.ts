import z from "zod"


export const ChannelSchema = z.object({
    id: z.string().uuid(),
    user_id: z.string(),
    name: z.string(),
    team_id: z.string(),
    created_at: z.date(),
})

export type Channel = z.infer<typeof ChannelSchema>