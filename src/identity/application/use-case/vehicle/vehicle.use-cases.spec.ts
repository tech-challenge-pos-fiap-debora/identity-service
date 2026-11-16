import { describe, expect, it } from '@jest/globals';
import { EntityNotFoundError } from '../../../../shared/domain/errors';
import { Client } from '../../../domain/entities/client';
import { Vehicle } from '../../../domain/entities/vehicle';
import { ClientRepositoryInterface } from '../../../domain/repositories/client.repository';
import { VehicleRepositoryInterface } from '../../../domain/repositories/vehicle.repository';
import { PlateVO } from '../../../../shared/domain/value-objects/plate.vo';
import { CreateVehicleUseCase } from './create-vehicle';
import { DeleteVehicleUseCase } from './delete-vehicle';
import { GetAllVehiclesUseCase } from './get-all-vehicles';
import { GetOrCreateVehicleUseCase } from './get-or-create-vehicle';
import { GetVehicleUseCase } from './get-vehicle';
import { UpdatedVehicleUseCase } from './update-vehicle';

const CLIENT_ID = '33333333-3333-4333-8333-333333333301';

function plateKey(plate: string): string {
  return PlateVO.parse(plate).value;
}

class InMemoryClientRepository implements ClientRepositoryInterface {
  public clients = new Map<string, Client>();

  create(data: Client): Promise<Client> {
    this.clients.set(data.id, data);
    return Promise.resolve(data);
  }

  find(): Promise<Client[]> {
    return Promise.resolve([...this.clients.values()]);
  }

  findById(id: string): Promise<Client | null> {
    return Promise.resolve(this.clients.get(id) ?? null);
  }

  findByDocument(): Promise<Client> {
    throw new Error('not implemented');
  }

  updateByDocument(): Promise<Client> {
    throw new Error('not implemented');
  }

  remove(): Promise<void> {
    return Promise.resolve();
  }
}

class InMemoryVehicleRepository implements VehicleRepositoryInterface {
  public vehicles = new Map<string, Vehicle>();

  create(data: Vehicle): Promise<Vehicle> {
    this.vehicles.set(data.plate, data);
    return Promise.resolve(data);
  }

  find(): Promise<Vehicle[]> {
    return Promise.resolve([...this.vehicles.values()].reverse());
  }

  findById(id: string): Promise<Vehicle | null> {
    return Promise.resolve(
      [...this.vehicles.values()].find((v) => v.id === id) ?? null,
    );
  }

  findByPlate(plate: string): Promise<Vehicle> {
    const v = this.vehicles.get(plateKey(plate));
    if (!v) throw new EntityNotFoundError('Vehicle not found');
    return Promise.resolve(v);
  }

  updateByPlate(
    plate: string,
    dataUpdate: Partial<{ model: string; brand: string; year: number }>,
  ): Promise<Vehicle> {
    const key = plateKey(plate);
    const current = this.vehicles.get(key);
    if (!current) throw new Error('not found');
    const updated = Vehicle.create(
      {
        clientId: current.clientId,
        plate: current.plate,
        model: dataUpdate.model ?? current.model,
        brand: dataUpdate.brand ?? current.brand,
        year: dataUpdate.year ?? current.year,
      },
      current.id,
    );
    this.vehicles.set(key, updated);
    return Promise.resolve(updated);
  }

  remove(plate: string): Promise<void> {
    this.vehicles.delete(plateKey(plate));
    return Promise.resolve();
  }
}

function seedClient(repo: InMemoryClientRepository): Client {
  const client = Client.create(
    {
      name: 'Cliente teste',
      document: '52998224725',
      email: 'cliente@test.dev',
    },
    CLIENT_ID,
  );
  void repo.create(client);
  return client;
}

describe('Vehicle use cases', () => {
  it('creates a vehicle linked to a client', async () => {
    const clients = new InMemoryClientRepository();
    seedClient(clients);
    const vehicles = new InMemoryVehicleRepository();
    const useCase = new CreateVehicleUseCase(vehicles, clients);

    const response = await useCase.execute({
      clientId: CLIENT_ID,
      plate: 'ABC-1234',
      model: 'HR-V',
      brand: 'Honda',
      year: 2024,
    });

    expect(response.id).toBeDefined();
    expect(response.clientId).toBe(CLIENT_ID);
    expect(response.plate).toBe('ABC1234');
    expect(response.model).toBe('HR-V');
    expect(vehicles.vehicles.size).toBe(1);
  });

  it('rejects vehicle when client does not exist', async () => {
    const clients = new InMemoryClientRepository();
    const vehicles = new InMemoryVehicleRepository();
    const useCase = new CreateVehicleUseCase(vehicles, clients);

    await expect(
      useCase.execute({
        clientId: CLIENT_ID,
        plate: 'ABC-1234',
        model: 'HR-V',
        brand: 'Honda',
        year: 2024,
      }),
    ).rejects.toBeInstanceOf(EntityNotFoundError);
  });

  it('gets a vehicle by plate', async () => {
    const repository = new InMemoryVehicleRepository();
    await repository.create(
      Vehicle.create({
        clientId: CLIENT_ID,
        plate: 'ABC-1234',
        model: 'HR-V',
        brand: 'Honda',
        year: 2024,
      }),
    );
    const useCase = new GetVehicleUseCase(repository);

    const response = await useCase.execute('ABC-1234');

    expect(response.plate).toBe('ABC1234');
    expect(response.clientId).toBe(CLIENT_ID);
    expect(response.brand).toBe('Honda');
  });

  it('lists all vehicles', async () => {
    const repository = new InMemoryVehicleRepository();
    await repository.create(
      Vehicle.create({
        clientId: CLIENT_ID,
        plate: 'XYZ-9000',
        model: 'Corolla',
        brand: 'Toyota',
        year: 2023,
      }),
    );
    await repository.create(
      Vehicle.create({
        clientId: CLIENT_ID,
        plate: 'ABC-1234',
        model: 'HR-V',
        brand: 'Honda',
        year: 2024,
      }),
    );
    const useCase = new GetAllVehiclesUseCase(repository);

    const rows = await useCase.execute();

    expect(rows).toHaveLength(2);
    expect(rows.map((v) => v.plate)).toEqual(['ABC1234', 'XYZ9000']);
  });

  it('updates a vehicle', async () => {
    const repository = new InMemoryVehicleRepository();
    await repository.create(
      Vehicle.create({
        clientId: CLIENT_ID,
        plate: 'ABC-1234',
        model: 'HR-V',
        brand: 'Honda',
        year: 2024,
      }),
    );
    const useCase = new UpdatedVehicleUseCase(repository);

    const response = await useCase.execute('ABC-1234', {
      model: 'Civic',
    });

    expect(response.model).toBe('Civic');
    expect(response.clientId).toBe(CLIENT_ID);
  });

  it('deletes a vehicle', async () => {
    const repository = new InMemoryVehicleRepository();
    await repository.create(
      Vehicle.create({
        clientId: CLIENT_ID,
        plate: 'ABC-1234',
        model: 'HR-V',
        brand: 'Honda',
        year: 2024,
      }),
    );
    const useCase = new DeleteVehicleUseCase(repository);

    await useCase.execute('ABC-1234');

    expect(repository.vehicles.has('ABC1234')).toBe(false);
  });

  it('get-or-create retorna existente ou cria novo', async () => {
    const repository = new InMemoryVehicleRepository();
    const useCase = new GetOrCreateVehicleUseCase(repository);
    const created = await useCase.execute({
      plate: 'XYZ-9A88',
      brand: 'Fiat',
      model: 'Argo',
      year: 2022,
      clientId: CLIENT_ID,
    });
    expect(created.plate).toBe(plateKey('XYZ-9A88'));
    expect(repository.vehicles.size).toBe(1);

    const same = await useCase.execute({
      plate: 'XYZ-9A88',
      brand: 'Outra',
      model: 'Outro',
      year: 2020,
      clientId: CLIENT_ID,
    });
    expect(same.id).toBe(created.id);
    expect(repository.vehicles.size).toBe(1);
  });
});
