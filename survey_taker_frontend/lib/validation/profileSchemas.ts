import { z } from 'zod';

export const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  age: z.number().int().min(13),
  gender: z.enum(['Male', 'Female', 'Other']),
  location: z.string().optional(),
  education: z.string().optional(),
  employment: z.string().optional(),
  incomeRange: z.string().optional(),
  interests: z.array(z.string()).min(3).max(10),
});

export type Profile = z.infer<typeof profileSchema>;
