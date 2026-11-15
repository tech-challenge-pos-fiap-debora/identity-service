import { Module } from '@nestjs/common';
import { AuthModule } from '../../../identity/infrastructure/ioc/auth.module';
import { ClientModule } from '../../../identity/infrastructure/ioc/client.module';
import { VehicleModule } from '../../../identity/infrastructure/ioc/vehicle.module';

@Module({
  imports: [AuthModule, ClientModule, VehicleModule],
})
export class IdentityModule {}
