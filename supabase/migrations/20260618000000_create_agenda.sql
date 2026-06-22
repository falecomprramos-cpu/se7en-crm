create table if not exists agenda (

id uuid default gen_random_uuid() primary key,

titulo text not null,

descricao text,

tipo text,

data_evento date,

horario time,

cliente_id uuid references clientes(id) on delete cascade,

created_at timestamp with time zone default now()

);