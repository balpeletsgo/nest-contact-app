import { Request } from 'express';
import { UserValidation } from 'src/user/user.validation';
import { z } from 'zod';

export interface RequestUserDTO extends Request {
  user: {
    id: string;
    email: string;
    name: string;
  };
}
export type GetProfileRequestDTO = z.infer<typeof UserValidation.GetProfile>;
