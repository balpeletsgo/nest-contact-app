import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { CommonModule } from './common/common.module';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './user/user.service';
import { ValidationService } from './validation/validation.service';

@Module({
  imports: [CommonModule],
  controllers: [AuthController],
  providers: [PrismaService, UserService, AuthService, ValidationService],
})
export class AppModule {}
