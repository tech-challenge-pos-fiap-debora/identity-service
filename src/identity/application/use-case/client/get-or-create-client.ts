import { Inject, Injectable } from '@nestjs/common';
import { Client } from '../../../domain/entities/client';
import { ClientStatus } from '../../../domain/entities/client-status';
import type { ClientRepositoryInterface } from '../../../domain/repositories/client.repository';
import { CLIENT_REPOSITORY } from '../../../domain/repositories/tokens';
import { EntityNotFoundError } from '../../../../shared/domain/errors';

export type GetOrCreateClientInput = {
  name: string;
  document: string;
  email: string;
};

@Injectable()
export class GetOrCreateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepo: ClientRepositoryInterface,
  ) {}

  async execute(input: GetOrCreateClientInput): Promise<Client> {
    try {
      return await this.clientRepo.findByDocument(input.document);
    } catch (error) {
      if (!(error instanceof EntityNotFoundError)) throw error;
    }
    return this.clientRepo.create(
      Client.create({
        document: input.document,
        name: input.name,
        email: input.email,
        status: ClientStatus.ACTIVE,
      }),
    );
  }
}
