import { Module } from '@nestjs/common';
import {
  CreateClientUseCase,
  DeleteClientUseCase,
  GetAllClientsUseCase,
  GetClientUseCase,
  UpdateClientUseCase,
} from '../../application/use-case/client';
import { ClientController } from '../../interfaces/http/client/client.controller';
import { IdentityDatabaseModule } from '../database/database.module';

@Module({
  imports: [IdentityDatabaseModule],
  providers: [
    CreateClientUseCase,
    GetAllClientsUseCase,
    GetClientUseCase,
    UpdateClientUseCase,
    DeleteClientUseCase,
  ],
  controllers: [ClientController],
  exports: [CreateClientUseCase, IdentityDatabaseModule],
})
export class ClientModule {}
