import { z } from 'zod';

export class PhoneValidation {
  static readonly CreatePhone = z.object({
    contactId: z
      .string({ required_error: 'Contact ID is required' })
      .uuid({ message: 'Invalid Contact ID format' }),
    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .min(1, 'Phone number is required')
      .min(10, 'Phone number must be at least 10 characters long')
      .max(20, 'Phone number must be at most 20 characters long')
      .refine((val) => /^62\d+$/.test(val), {
        message: 'Phone number must start with 62 and contain only digits',
      }),
  });

  static readonly GetPhoneById = z.object({
    contactId: z
      .string({ required_error: 'Contact ID is required' })
      .uuid({ message: 'Invalid Contact ID format' }),
    phoneId: z
      .string({ required_error: 'Phone ID is required' })
      .uuid({ message: 'Invalid Phone ID format' }),
  });

  static readonly UpdatePhone = z.object({
    phoneId: z
      .string({ required_error: 'Phone ID is required' })
      .uuid({ message: 'Invalid Phone ID format' }),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .min(10, 'Phone number must be at least 10 characters long')
      .max(20, 'Phone number must be at most 20 characters long')
      .refine((val) => /^62\d+$/.test(val), {
        message: 'Phone number must start with 62 and contain only digits',
      })
      .optional(),
  });
}
