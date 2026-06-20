alter table agenda
add column if not exists lead_id uuid;


alter table agenda
add constraint agenda_lead_fk
foreign key (lead_id)
references leads(id)
on delete set null;