import { Inject, Injectable } from '@nestjs/common';
import { Vehicle } from '../../../domain/entities/vehicle';
import type { VehicleRepositoryInterface } from '../../../domain/repositories/vehicle.repository';
import { VEHICLE_REPOSITORY } from '../../../domain/repositories/tokens';
import { EntityNotFoundError } from '../../../../shared/domain/errors';

export type GetOrCreateVehicleInput = {
  plate: string;
  brand: string;
  model: string;
  year: number;
  clientId: string;
};

@Injectable()
export class GetOrCreateVehicleUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepo: VehicleRepositoryInterface,
  ) {}

  async execute(input: GetOrCreateVehicleInput): Promise<Vehicle> {
    try {
      return await this.vehicleRepo.findByPlate(input.plate);
    } catch (error) {
      if (!(error instanceof EntityNotFoundError)) throw error;
    }
    return this.vehicleRepo.create(
      Vehicle.create({
        clientId: input.clientId,
        plate: input.plate,
        brand: input.brand,
        model: input.model,
        year: input.year,
      }),
    );
  }
}
