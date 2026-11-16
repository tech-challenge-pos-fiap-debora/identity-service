import { Module } from '@nestjs/common';
import {
  CreateVehicleUseCase,
  DeleteVehicleUseCase,
  GetAllVehiclesUseCase,
  GetVehicleUseCase,
  UpdatedVehicleUseCase,
  GetOrCreateVehicleUseCase,
} from '../../application/use-case/vehicle';
import { VehicleController } from '../../interfaces/http/vehicle/vehicle.controller';
import { VehicleIntegrationController } from '../../interfaces/http/vehicle/vehicle-integration.controller';
import { IdentityDatabaseModule } from '../database/database.module';

@Module({
  imports: [IdentityDatabaseModule],
  providers: [
    CreateVehicleUseCase,
    DeleteVehicleUseCase,
    GetAllVehiclesUseCase,
    GetVehicleUseCase,
    UpdatedVehicleUseCase,
    GetOrCreateVehicleUseCase,
  ],
  controllers: [VehicleController, VehicleIntegrationController],
  exports: [CreateVehicleUseCase, IdentityDatabaseModule],
})
export class VehicleModule {}
