import { Module } from '@nestjs/common';
import { AuthController } from 'src/auth/auth.controller';
import { AuthService } from 'src/auth/auth.service';
import { CommonModule } from 'src/common/common.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { ValidationService } from 'src/validation/validation.service';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [CommonModule, ContactModule],
  controllers: [AuthController, UserController],
  providers: [PrismaService, UserService, AuthService, ValidationService],
})
export class AppModule {}
