import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidationService } from 'src/validation/validation.service';
import { ErrorFilter } from './error.filter';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'some-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [
    PrismaService,
    ValidationService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
  exports: [PrismaService, ValidationService],
})
export class CommonModule {}
