import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [CommonModule, AuthModule, UserModule, ContactModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
