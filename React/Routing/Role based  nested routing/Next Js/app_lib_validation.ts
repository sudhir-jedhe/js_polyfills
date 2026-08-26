import { z } from "zod"

export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(100),
  csrfToken: z.string(),
  twoFactorToken: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>

