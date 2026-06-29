alter table clientes
add column if not exists whatsapp text;

alter table clientes
add column if not exists instagram text;

alter table clientes
add column if not exists segmento text;

alter table clientes
add column if not exists origem text;