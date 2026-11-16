import { Module } from '@nestjs/common';
import { ConfigureModule } from './shared/infrastructure/configure/configure.module';
import { ObservabilityModule } from './shared/infrastructure/observability/observability.module';
import { HealthModule } from './shared/infrastructure/ioc/health.module';
import { IdentityModule } from './shared/infrastructure/ioc/identity.module';

@Module({
  imports: [
    ConfigureModule,
    ObservabilityModule,
    HealthModule,
    IdentityModule,
  ],
})
export class AppModule {}
