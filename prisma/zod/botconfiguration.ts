import * as z from "zod"
import { CompleteUser, relatedUserSchema } from "./index"

export const botConfigurationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  enabled: z.boolean(),
})

export interface CompleteBotConfiguration extends z.infer<typeof botConfigurationSchema> {
  user: CompleteUser
}

/**
 * relatedBotConfigurationSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedBotConfigurationSchema: z.ZodSchema<CompleteBotConfiguration> = z.lazy(() => botConfigurationSchema.extend({
  user: relatedUserSchema,
}))
