alter table projetos
add column if not exists servico_id uuid;

alter table projetos
add column if not exists data_inicio date;

alter table projetos
add column if not exists data_prazo date;

alter table projetos
add column if not exists progresso integer default 0;

