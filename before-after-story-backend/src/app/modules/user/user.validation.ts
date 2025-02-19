import { z } from 'zod';
import { Role, USER_ROLE } from './user.constants';

const guestValidationSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    password: z.string({ required_error: 'Password is required' }).optional(),
  }),
});

export const userValidation = {
  guestValidationSchema,
};
