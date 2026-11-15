export type VehicleCreateBody = {
  clientId: string;
  plate: string;
  model: string;
  brand: string;
  year: number;
};

/** Placa Mercosul válida (compacta). */
export const VALID_PLATE_VEHICLES = 'ABC1D23';

export function newVehicleCreateBody(
  overrides: Partial<VehicleCreateBody> = {},
): VehicleCreateBody {
  return {
    clientId: overrides.clientId ?? '00000000-0000-4000-8000-000000000000',
    plate: VALID_PLATE_VEHICLES,
    model: 'Onix',
    brand: 'Chevrolet',
    year: 2022,
    ...overrides,
  };
}
