create table if not exists posts (

id uuid default gen_random_uuid() primary key,

cliente_id uuid references clientes(id) on delete cascade,

titulo text not null,

conteudo text,

tipo text,

data_post date,

status text default 'pendente',

created_at timestamp with time zone default now()

);