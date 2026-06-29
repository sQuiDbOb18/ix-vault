create extension if not exists "uuid-ossp";

create table if not exists members (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  tag text,
  role text default 'Member' check (role in ('Member','Officer','Commander')),
  joined_at date default current_date,
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid references members(id) on delete set null,
  member_name text not null,
  amount numeric(12,2) not null check (amount > 0),
  payment_date date not null,
  due_date date,
  status text not null default 'Pending' check (status in ('Paid','Pending','Overdue')),
  transaction_ref text,
  payment_method text default 'Transfer' check (payment_method in ('Transfer','Cash','Other')),
  notes text,
  receipt_url text,
  receipt_path text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists activity_log (
  id uuid primary key default uuid_generate_v4(),
  action text not null,
  member_name text,
  amount numeric(12,2),
  metadata jsonb,
  created_at timestamptz default now()
);

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists payments_updated_at on payments;
create trigger payments_updated_at
  before update on payments
  for each row execute function update_updated_at();

create or replace function upsert_member_on_payment()
returns trigger as $$
begin
  insert into members (name) values (new.member_name)
  on conflict (name) do nothing;
  select id into new.member_id from members where name = new.member_name;
  return new;
end;
$$ language plpgsql;

drop trigger if exists payment_member_sync on payments;
create trigger payment_member_sync
  before insert on payments
  for each row execute function upsert_member_on_payment();

create or replace function log_payment_activity()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    insert into activity_log (action, member_name, amount, metadata)
    values ('payment_added', new.member_name, new.amount, row_to_json(new)::jsonb);
    return new;
  elsif tg_op = 'UPDATE' then
    insert into activity_log (action, member_name, amount, metadata)
    values ('payment_updated', new.member_name, new.amount, jsonb_build_object('old_status', old.status, 'new_status', new.status));
    return new;
  elsif tg_op = 'DELETE' then
    insert into activity_log (action, member_name, amount, metadata)
    values ('payment_deleted', old.member_name, old.amount, row_to_json(old)::jsonb);
    return old;
  end if;
  return null;
end;
$$ language plpgsql;

drop trigger if exists payments_activity_log on payments;
create trigger payments_activity_log
  after insert or update or delete on payments
  for each row execute function log_payment_activity();

create index if not exists payments_status_idx on payments(status);
create index if not exists payments_member_name_idx on payments(member_name);
create index if not exists payments_date_idx on payments(payment_date desc);
create index if not exists activity_log_created_idx on activity_log(created_at desc);

insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', true)
on conflict (id) do nothing;
