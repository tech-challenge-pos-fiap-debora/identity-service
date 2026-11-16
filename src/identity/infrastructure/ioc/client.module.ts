import { Module } from '@nestjs/common';
import {
  CreateClientUseCase,
  DeleteClientUseCase,
  GetAllClientsUseCase,
  GetClientUseCase,
  UpdateClientUseCase,
  GetOrCreateClientUseCase,
} from '../../application/use-case/client';
import { ClientController } from '../../interfaces/http/client/client.controller';
import { ClientIntegrationController } from '../../interfaces/http/client/client-integration.controller';
import { IdentityDatabaseModule } from '../database/database.module';

@Module({
  imports: [IdentityDatabaseModule],
  providers: [
    CreateClientUseCase,
    GetAllClientsUseCase,
    GetClientUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
    GetOrCreateClientUseCase,
  ],
  controllers: [ClientController, ClientIntegrationController],
  exports: [CreateClientUseCase, IdentityDatabaseModule],
})
export class ClientModule {}
