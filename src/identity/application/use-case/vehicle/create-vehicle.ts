import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundError } from '../../../../shared/domain/errors';
import { Vehicle } from '../../../domain/entities/vehicle';
import type { ClientRepositoryInterface } from '../../../domain/repositories/client.repository';
import type { VehicleRepositoryInterface } from '../../../domain/repositories/vehicle.repository';
import {
  CLIENT_REPOSITORY,
  VEHICLE_REPOSITORY,
} from '../../../domain/repositories/tokens';
import type { CreateVehicleInput } from './vehicle.inputs';

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepo: VehicleRepositoryInterface,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepo: ClientRepositoryInterface,
  ) {}

  async execute(input: CreateVehicleInput): Promise<Vehicle> {
    const client = await this.clientRepo.findById(input.clientId);
    if (!client) {
      throw new EntityNotFoundError('Client not found');
    }

    const vehicle = Vehicle.create({
      clientId: input.clientId,
      plate: input.plate,
      model: input.model,
      brand: input.brand,
      year: input.year,
    });

    return this.vehicleRepo.create(vehicle);
  }
}
