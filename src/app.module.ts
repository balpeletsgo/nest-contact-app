import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { PhoneModule } from './phone/phone.module';
import { PrometheusController } from './prometheus/prometheus.controller';
import { PrometheusService } from './prometheus/prometheus.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [CommonModule, AuthModule, UserModule, ContactModule, PhoneModule],
  controllers: [PrometheusController],
  providers: [PrometheusService],
})
export class AppModule {}
