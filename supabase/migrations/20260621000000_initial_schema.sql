-- Gym
create table if not exists gym_logs (
  id uuid primary key default gen_random_uuid(),
  date text not null,
  routine_id text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists weight_history (
  id uuid primary key default gen_random_uuid(),
  date text not null,
  weight numeric not null,
  created_at timestamptz default now()
);

-- Agenda
create table if not exists agenda_events (
  id uuid primary key default gen_random_uuid(),
  date text not null,
  time text,
  title text not null,
  description text,
  color text,
  created_at timestamptz default now()
);

-- Gastos
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  date text not null,
  amount numeric not null,
  category text,
  description text,
  created_at timestamptz default now()
);

-- Tareas
create table if not exists task_folders (
  id text primary key,
  name text not null,
  emoji text,
  color text
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  done boolean default false,
  date text,
  priority text,
  folder_id text references task_folders(id),
  notes text,
  created_at timestamptz default now()
);

-- Hábitos
create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  emoji text,
  color text
);

create table if not exists habit_logs (
  date text not null,
  habit_id uuid references habits(id),
  primary key (date, habit_id)
);

-- Notas
create table if not exists note_folders (
  id text primary key,
  name text not null,
  emoji text,
  color text
);

create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,
  folder_id text references note_folders(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Metas
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  month text not null,
  type text,
  title text,
  target numeric,
  current numeric default 0,
  color text,
  unit text,
  created_at timestamptz default now()
);
