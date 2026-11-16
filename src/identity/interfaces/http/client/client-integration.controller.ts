import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetOrCreateClientUseCase } from '../../../application/use-case/client/get-or-create-client';
import { GetClientUseCase } from '../../../application/use-case/client/get-client';
import type { ClientRepositoryInterface } from '../../../domain/repositories/client.repository';
import { CLIENT_REPOSITORY } from '../../../domain/repositories/tokens';
import { Inject } from '@nestjs/common';
import { ClientResponseDto } from './dtos/client-response.dto';

/**
 * Contrato consumido pelo order-service (`/client/...`).
 * Sem JWT no lab (rede local); em prod fica atrás da mesh/rede privada.
 */
@ApiTags('Identidade / Integração Cliente')
@Controller('client')
export class ClientIntegrationController {
  constructor(
    private readonly getOrCreate: GetOrCreateClientUseCase,
    @Inject(CLIENT_REPOSITORY)
    private readonly clients: ClientRepositoryInterface,
  ) {}

  @Post('get-or-create')
  async getOrCreateClient(
    @Body()
    body: { name: string; document: string; email: string },
  ): Promise<ClientResponseDto> {
    const client = await this.getOrCreate.execute(body);
    return ClientResponseDto.toDto(client);
  }

  /** Usado pela lambda-auth (login CPF). Declarado antes de `:id`. */
  @Get('by-document/:document')
  async byDocument(
    @Param('document') document: string,
  ): Promise<ClientResponseDto> {
    const client = await this.clients.findByDocument(document);
    return ClientResponseDto.toDto(client);
  }

  @Get(':id')
  async byId(@Param('id') id: string): Promise<ClientResponseDto | null> {
    const client = await this.clients.findById(id);
    return client ? ClientResponseDto.toDto(client) : null;
  }
}
