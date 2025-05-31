import { z } from 'zod';

export class AuthValidation {
  static readonly SignUp = z
    .object({
      name: z
        .string({ required_error: 'Name is required' })
        .min(1, 'Name is required')
        .max(255, 'Name must be less than 255 characters')
        .refine(
          (val) => {
            return /^[a-zA-Z\s]+$/.test(val);
          },
          {
            message: 'Name must contain only letters and spaces',
          },
        ),
      email: z
        .string({ required_error: 'Email is required' })
        .min(1, 'Email is required')
        .email('Invalid email format'),
      password: z
        .string({
          required_error: 'Password is required',
        })
        .min(8, 'Password must be at least 8 characters long')
        .max(255, 'Password must be less than 255 characters'),
      confirmPassword: z
        .string({
          required_error: 'Confirm Password is required',
        })
        .min(8, 'Confirm Password must be at least 8 characters long')
        .max(255, 'Confirm Password must be less than 255 characters'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });
  static readonly SignIn = z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .min(1, 'Email is required')
      .email('Invalid email format'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, 'Password must be at least 8 characters long')
      .max(255, 'Password must be less than 255 characters'),
  });
}
