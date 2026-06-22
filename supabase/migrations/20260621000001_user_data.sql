create table if not exists user_data (
  key text primary key,
  value text
);

alter table user_data enable row level security;
create policy "allow all" on user_data for all using (true) with check (true);
