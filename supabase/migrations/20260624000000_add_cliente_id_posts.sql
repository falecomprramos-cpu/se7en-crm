alter table posts
add column if not exists cliente_id uuid;


alter table posts
add constraint posts_cliente_fk
foreign key (cliente_id)
references clientes(id)
on delete cascade;