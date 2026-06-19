create table if not exists leads (

id uuid default gen_random_uuid() primary key,

nome text not null,

telefone text,

email text,

origem text,

status text default 'novo',

created_at timestamp with time zone default now()

);