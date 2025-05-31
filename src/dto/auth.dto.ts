import { z } from 'zod';
import { AuthValidation } from '../auth/auth.validation';

export type SignUpRequestDTO = z.infer<typeof AuthValidation.SignUp>;
export type SignInRequestDTO = z.infer<typeof AuthValidation.SignIn>;
