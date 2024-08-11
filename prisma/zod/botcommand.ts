import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const botCommandSchema = z.object({
  id: z.string(),
  userId: z.string(),
  command: z.string(),
  response: z.string(),
  cooldown: z.number().int(),
  aliases: z.string(),
  minRole: z.number().int(),
  enabled: z.boolean(),
})

export interface CompleteBotCommand extends z.infer<typeof botCommandSchema> {
  user: CompleteUser
}

/**
 * relatedBotCommandSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedBotCommandSchema: z.ZodSchema<CompleteBotCommand> = z.lazy(() => botCommandSchema.extend({
  user: relatedUserSchema,
}))
