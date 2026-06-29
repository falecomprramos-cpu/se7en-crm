create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  empresa text,
  whatsapp text,
  instagram text,
  segmento text,
  origem text,
  created_at timestamp default now()
);