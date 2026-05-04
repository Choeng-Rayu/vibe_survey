import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8)
  .regex(/[A-Z]/, 'uppercase required')
  .regex(/[a-z]/, 'lowercase required')
  .regex(/[0-9]/, 'number required');

export const registrationEmailSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const registrationPhoneSchema = z.object({
  phone: z.string().regex(/^\+855\d{8,9}$/, 'Must be +855 format'),
  password: passwordSchema,
});

export const loginSchema = z.object({
  identifier: z.string(), // email or phone
  password: passwordSchema,
});
