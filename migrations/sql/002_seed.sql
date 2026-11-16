INSERT INTO client (id, name, document, email, status, created_at, updated_at)
VALUES
  ('33333333-3333-4333-8333-333333333301', 'Cliente demo (migration)', '52998224725', 'cliente.demo@local.dev', 'ACTIVE', NOW(), NOW())
ON CONFLICT (document) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  status = EXCLUDED.status,
  updated_at = NOW();

INSERT INTO vehicle (id, client_id, plate, model, brand, year, created_at, updated_at)
VALUES
  (
    '44444444-4444-4444-8444-444444444401',
    '33333333-3333-4333-8333-333333333301',
    'APL1234',
    'Onix',
    'Chevrolet',
    2022,
    NOW(),
    NOW()
  )
ON CONFLICT (plate) DO UPDATE SET
  client_id = EXCLUDED.client_id,
  model = EXCLUDED.model,
  brand = EXCLUDED.brand,
  year = EXCLUDED.year,
  updated_at = NOW();
