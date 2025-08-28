//tem que comecar com a palavra VITE
import { z } from 'zod'

const envSchema = z.object({
  MODE: z.enum(['production', 'development', 'test']),
  VITE_BACKEND_URL: z.string(),
})

export const env = envSchema.parse(import.meta.env)
