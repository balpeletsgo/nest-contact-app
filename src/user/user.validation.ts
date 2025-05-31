import { z } from 'zod';

export class UserValidation {
  static readonly GetProfile = z.object({
    userId: z
      .string({ required_error: 'User ID is required' })
      .min(1, 'User ID is required')
      .cuid({ message: 'Invalid User ID format' }),
  });
}
