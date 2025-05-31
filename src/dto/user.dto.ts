import { Request } from 'express';
import { UserValidation } from 'src/user/user.validation';
import { z } from 'zod';

export class UserRequestDTO {
  id: string;
  email: string;
  name: string;
}

export interface UserRequest extends Request {
  user: UserRequestDTO;
}

export type GetProfileRequestDTO = z.infer<typeof UserValidation.GetProfile>;
export type UpdateProfileRequestDTO = z.infer<
  typeof UserValidation.UpdateProfile
>;
