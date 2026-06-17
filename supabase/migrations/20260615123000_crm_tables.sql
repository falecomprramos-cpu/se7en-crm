create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  empresa text,
  avatar_url text,
  created_at timestamp default now()
);


create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  nome text not null,
  email text,
  telefone text,
  empresa text,
  status text default 'Ativo',
  observacoes text,
  created_at timestamp default now()
);


create table public.projetos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  cliente_id uuid references public.clientes(id) on delete cascade,
  nome text not null,
  descricao text,
  status text default 'Em andamento',
  valor numeric default 0,
  created_at timestamp default now()
);


create table public.tarefas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  titulo text not null,
  descricao text,
  status text default 'Pendente',
  prioridade text default 'Normal',
  data_limite date,
  created_at timestamp default now()
);


create table public.vendas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  cliente_id uuid references public.clientes(id),
  valor numeric default 0,
  status text default 'Aberta',
  created_at timestamp default now()
);