/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        success: false,
        status: exception.getStatus(),
        message: exception.message,
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      const formattedErrors = exception.errors.map((error) => ({
        message: error.message,
        path: error.path,
      }));
      response.status(400).json({
        success: false,
        status: 400,
        message: 'Validation error',
        errors: formattedErrors,
      });
    } else {
      response.status(500).json({
        success: false,
        status: 500,
        message: 'Internal server error',
        errors: exception.message,
      });
    }
  }
}
