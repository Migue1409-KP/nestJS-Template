import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  image: z.string().url('Invalid URL format').optional(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
