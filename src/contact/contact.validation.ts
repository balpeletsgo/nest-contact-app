import { z } from 'zod';

export class ContactValidation {
  static readonly CreateContact = z.object({
    firstName: z
      .string({ required_error: 'First name is required' })
      .min(1, 'First name must be at least 1 characters long')
      .max(255, 'First name must be at most 255 characters long'),
    lastName: z
      .string()
      .max(255, 'Last name must be at most 255 characters long')
      .optional(),
    email: z
      .union([
        z.literal(''),
        z
          .string()
          .email()
          .max(255, 'Email must be at most 255 characters long'),
      ])

      .optional(),
  });

  static readonly SearchContact = z.object({
    query: z
      .string()
      .max(255, 'Search term must be at most 255 characters long')
      .optional(),
    size: z
      .number()
      .min(1, 'Size must be at least 1')
      .max(100, 'Size must be at most 100')
      .default(10),
    page: z
      .number()
      .min(1, 'Page must be at least 1')
      .default(1)
      .refine((val) => Number.isInteger(val), 'Page must be an integer'),
  });

  static readonly GetContactById = z.object({
    contactId: z
      .string({ required_error: 'Contact ID is required' })
      .uuid({ message: 'Invalid Contact ID format' }),
  });

  static readonly UpdateContact = z.object({
    contactId: z
      .string({ required_error: 'Contact ID is required' })
      .uuid({ message: 'Invalid Contact ID format' }),
    firstName: z
      .string()
      .min(1, 'First name must be at least 1 characters long')
      .max(255, 'First name must be at most 255 characters long')
      .optional(),
    lastName: z
      .string()
      .max(255, 'Last name must be at most 255 characters long')
      .optional(),
    email: z
      .union([
        z.literal(''),
        z
          .string()
          .email()
          .max(255, 'Email must be at most 255 characters long'),
      ])
      .optional(),
  });
}
