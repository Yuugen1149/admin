-- Create the dashboard metrics table
create table if not exists dashboard_metrics (
  id bigint primary key default 1,
  total_members text not null default '0',
  upcoming_events text not null default '0',
  active_projects text not null default '0',
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert initial row if not exists
insert into dashboard_metrics (id, total_members, upcoming_events, active_projects)
values (1, '17', '3', '5')
on conflict (id) do nothing;

-- Enable RLS (Optional but good practice)
alter table dashboard_metrics enable row level security;

-- Policy: Everyone can read
drop policy if exists "Everyone can read dashboard metrics" on dashboard_metrics;
create policy "Everyone can read dashboard metrics"
  on dashboard_metrics for select
  using (true);

-- Policy: Allow anon updates (API layer handles RBAC)
drop policy if exists "Authenticated users can update metrics" on dashboard_metrics; -- Drop old name
drop policy if exists "Everyone can update metrics" on dashboard_metrics; -- Drop current name
create policy "Everyone can update metrics"
  on dashboard_metrics for update
  using (true);

-- Policy: Allow anon inserts (Required for upsert if row is missing)
drop policy if exists "Authenticated users can insert metrics" on dashboard_metrics; -- Drop old name
drop policy if exists "Everyone can insert metrics" on dashboard_metrics; -- Drop current name
create policy "Everyone can insert metrics"
  on dashboard_metrics for insert
  with check (true);
