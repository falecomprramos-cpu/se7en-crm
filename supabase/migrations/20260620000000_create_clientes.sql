create table if not exists clientes (

id uuid default gen_random_uuid() primary key,

nome text not null,

empresa text,

whatsapp text,

instagram text,

segmento text,

email text unique,

senha text,

status text default 'ativo',

created_at timestamp with time zone default now()

);