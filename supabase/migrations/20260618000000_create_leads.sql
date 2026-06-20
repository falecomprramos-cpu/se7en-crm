alter table leads
add column if not exists empresa text;

alter table leads
add column if not exists whatsapp text;

alter table leads
add column if not exists instagram text;

alter table leads
add column if not exists segmento text;

alter table leads
add column if not exists origem text;