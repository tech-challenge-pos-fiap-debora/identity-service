import { Module } from '@nestjs/common';
import {
  CreateVehicleUseCase,
  DeleteVehicleUseCase,
  GetAllVehiclesUseCase,
  GetVehicleUseCase,
  UpdatedVehicleUseCase,
} from '../../application/use-case/vehicle';
import { VehicleController } from '../../interfaces/http/vehicle/vehicle.controller';
import { IdentityDatabaseModule } from '../database/database.module';

@Module({
  imports: [IdentityDatabaseModule],
  providers: [
    CreateVehicleUseCase,
    DeleteVehicleUseCase,
    GetAllVehiclesUseCase,
    GetVehicleUseCase,
    UpdatedVehicleUseCase,
  ],
  controllers: [VehicleController],
  exports: [CreateVehicleUseCase, IdentityDatabaseModule],
})
export class VehicleModule {}
