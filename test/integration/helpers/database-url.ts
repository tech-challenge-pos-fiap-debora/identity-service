/**
 * URL dos testes de integração.
 *
 * Por defeito: Postgres no host na porta 5432 (GitHub Actions service container).
 * No docker-compose local o Postgres publica 5433 — use:
 *   INTEGRATION_DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5433/identity
 *
 * Não reutiliza DATABASE_URL genérica para evitar apontar ao RDS por engano.
 */
export const INTEGRATION_DATABASE_URL =
  process.env.INTEGRATION_DATABASE_URL ??
  'postgresql://postgres:postgres@127.0.0.1:5432/identity';
