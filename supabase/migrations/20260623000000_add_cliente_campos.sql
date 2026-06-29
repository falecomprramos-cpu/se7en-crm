alter table clientes
add column if not exists senha_acesso text;

alter table clientes
add column if not exists status_cliente text default 'ativo';