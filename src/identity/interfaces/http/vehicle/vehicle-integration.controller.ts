import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetOrCreateVehicleUseCase } from '../../../application/use-case/vehicle/get-or-create-vehicle';
import { VehicleResponseDto } from './dtos/vehicle-response.dto';

@ApiTags('Identidade / Integração Veículo')
@Controller('vehicle')
export class VehicleIntegrationController {
  constructor(private readonly getOrCreate: GetOrCreateVehicleUseCase) {}

  @Post('get-or-create')
  async getOrCreateVehicle(
    @Body()
    body: {
      plate: string;
      brand: string;
      model: string;
      year: number;
      clientId: string;
    },
  ): Promise<VehicleResponseDto> {
    const vehicle = await this.getOrCreate.execute(body);
    return VehicleResponseDto.toDto(vehicle);
  }
}
