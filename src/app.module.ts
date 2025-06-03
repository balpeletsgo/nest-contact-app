import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { UserModule } from './user/user.module';
import { PhoneModule } from './phone/phone.module';
import { MetricsController } from './metrics/metrics.controller';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UserModule,
    ContactModule,
    PhoneModule,
    PrometheusModule.register(),
  ],
  controllers: [MetricsController],
  providers: [],
})
export class AppModule {}
