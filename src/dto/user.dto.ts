import { Request } from 'express';
import { UserValidation } from 'src/user/user.validation';
import { z } from 'zod';

export interface UserRequest extends Request {
  user: UserRequestDTO;
}

export class UserRequestDTO {
  id: string;
  email: string;
  name: string;
}

export type GetProfileRequestDTO = z.infer<typeof UserValidation.GetProfile>;
export type UpdateProfileRequestDTO = z.infer<
  typeof UserValidation.UpdateProfile
>;
