import { z } from 'zod';

export class UserValidation {
  static readonly GetProfile = z.object({
    userId: z
      .string({ required_error: 'User ID is required' })
      .min(1, 'User ID is required')
      .cuid({ message: 'Invalid User ID format' }),
  });

  static readonly UpdateProfile = z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name must be at least 1 characters long')
      .max(255, 'Name must be at most 255 characters long')
      .optional(),
  });
}
