-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- 1. Projects Table
create table projects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  image_url text,
  link text,
  tags text[] -- Array of strings for categories
);

alter table projects enable row level security;

create policy "Enable read access for all users"
on projects for select
to anon, authenticated
using (true);

create policy "Enable insert for authenticated users only"
on projects for insert
to authenticated
with check (true);

create policy "Enable update for authenticated users only"
on projects for update
to authenticated
using (true);

create policy "Enable delete for authenticated users only"
on projects for delete
to authenticated
using (true);

-- 2. Site Settings Table (Contact Info)
create table site_settings (
  id int primary key default 1,
  email text,
  phone text,
  address text,
  social_links jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table site_settings enable row level security;

create policy "Enable read access for all users"
on site_settings for select
to anon, authenticated
using (true);

create policy "Enable update for authenticated users only"
on site_settings for update
to authenticated
using (true);

-- Insert default settings row
insert into site_settings (id, email, phone, address, social_links)
values (1, 'contact@noveyra.com', '+1234567890', 'Cairo, Egypt', '{"facebook": "", "twitter": "", "instagram": ""}'::jsonb)
on conflict (id) do nothing;

-- 3. Storage Bucket for Project Images
insert into storage.buckets (id, name, public) 
values ('project-images', 'project-images', true)
on conflict (id) do nothing;

create policy "Give public access to project-images"
on storage.objects for select
to public
using ( bucket_id = 'project-images' );

create policy "Enable upload for authenticated users"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'project-images' );
