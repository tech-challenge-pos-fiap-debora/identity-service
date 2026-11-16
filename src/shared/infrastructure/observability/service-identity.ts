/** Nome canônico deste microsserviço em logs, APM e eventos. */
export const SERVICE_NAME = 'identity-service';

/** Componente curto (labels K8s / NR). */
export const SERVICE_COMPONENT = 'identity';

export const SERVICE_TELEMETRY_ATTRIBUTES = {
  service: SERVICE_NAME,
  'service.name': SERVICE_NAME,
  'service.component': SERVICE_COMPONENT,
} as const;
