-- ============================================================
-- ALPA Creativa — Esquema Supabase (plan gratis, 0 €)
-- Cómo aplicarlo:
--   1. Crea el proyecto en https://supabase.com con TU email.
--   2. Abre SQL Editor > New query, pega este fichero y Run.
--   3. Ve a Storage > crea el bucket "productos" (público de LECTURA).
--   4. Ve a Authentication > Users > invita tu email y MAÑANA el de ella.
--   5. Añade los dos emails en la tabla admin_emails (ver PASO 5 abajo).
-- ============================================================

-- ---------- PASO 1: categorías cerradas (las 11 actuales de js/data.js) ----------
create table if not exists public.categories (
  slug text primary key,
  name text not null
);

insert into public.categories (slug, name) values
  ('novedades', 'Novedades'),
  ('ediciones-especiales', 'Ediciones Especiales'),
  ('linea-deportiva', 'Línea Deportiva'),
  ('laboral', 'Laboral'),
  ('ropa', 'Ropa'),
  ('fechas-especiales', 'Fechas Especiales'),
  ('colecciones', 'Colecciones'),
  ('hogar', 'Hogar'),
  ('complementos', 'Complementos'),
  ('outlet', 'Outlet'),
  ('bordados-personalizados', 'Bordados Personalizados')
on conflict (slug) do update set name = excluded.name;

-- ---------- PASO 2: productos ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  description text not null default '',
  price numeric(10,2) not null check (price >= 0),
  category text not null references public.categories (slug) on update cascade,
  subcategory text not null default '',
  sizes text[] not null default '{}',
  colors jsonb not null default '[]'::jsonb,
  image_url text not null default '',
  image_urls text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_active_idx on public.products (active);

-- updated_at automático
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists products_touch on public.products;
create trigger products_touch
  before update on public.products
  for each row execute function public.touch_updated_at();

-- ---------- PASO 3: quién puede administrar (solo emails invitados) ----------
create table if not exists public.admin_emails (
  email text primary key
);

-- ---------- PASO 4: seguridad (RLS) ----------
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.admin_emails enable row level security;

-- Todo el mundo puede VER categorías y productos activos (la tienda es pública)
drop policy if exists "public read categories" on public.categories;
create policy "public read categories"
  on public.categories for select using (true);

drop policy if exists "public read active products" on public.products;
create policy "public read active products"
  on public.products for select using (active = true);

-- Solo un usuario logueado cuyo email esté en admin_emails puede ESCRIBIR
-- (el panel admin.html comprueba lo mismo en el navegador para ocultar botones)
drop policy if exists "admin insert products" on public.products;
create policy "admin insert products"
  on public.products for insert
  with check (exists (
    select 1 from public.admin_emails a
    where lower(a.email) = lower(auth.jwt() ->> 'email')
  ));

drop policy if exists "admin update products" on public.products;
create policy "admin update products"
  on public.products for update
  using (exists (
    select 1 from public.admin_emails a
    where lower(a.email) = lower(auth.jwt() ->> 'email')
  ));

drop policy if exists "admin delete products" on public.products;
create policy "admin delete products"
  on public.products for delete
  using (exists (
    select 1 from public.admin_emails a
    where lower(a.email) = lower(auth.jwt() ->> 'email')
  ));

-- Un admin puede verse/comprobarse en la lista (para el login del panel)
drop policy if exists "admin read admin_emails" on public.admin_emails;
create policy "admin read admin_emails"
  on public.admin_emails for select
  using (lower(email) = lower(auth.jwt() ->> 'email'));

-- Fotos: el bucket "productos" se crea desde el panel (Storage > New bucket,
-- nombre "productos", público). Las 4 policies de abajo se aplican con el
-- bloque STORAGE incluido al final de este fichero (no hay que tocar la
-- pestaña Policies a mano).

-- ---------- PASO 5: dar acceso (ejecutar con TU email hoy, y el de ELLA mañana) ----------
-- insert into public.admin_emails (email) values
--   ('tu@email.com'),
--   ('ella@email.com')
-- on conflict do nothing;

-- ---------- PASO 6: policies del bucket "productos" (pegar y Run tras crear el bucket) ----------
-- Lectura pública de fotos
drop policy if exists "public read productos" on storage.objects;
create policy "public read productos"
  on storage.objects for select
  using (bucket_id = 'productos');

-- Solo admins pueden subir
drop policy if exists "admin insert productos" on storage.objects;
create policy "admin insert productos"
  on storage.objects for insert
  with check (
    bucket_id = 'productos'
    and exists (select 1 from public.admin_emails a
                where lower(a.email) = lower(auth.jwt() ->> 'email'))
  );

-- Solo admins pueden actualizar
drop policy if exists "admin update productos" on storage.objects;
create policy "admin update productos"
  on storage.objects for update
  using (
    bucket_id = 'productos'
    and exists (select 1 from public.admin_emails a
                where lower(a.email) = lower(auth.jwt() ->> 'email'))
  )
  with check (
    bucket_id = 'productos'
    and exists (select 1 from public.admin_emails a
                where lower(a.email) = lower(auth.jwt() ->> 'email'))
  );

-- Solo admins pueden borrar
drop policy if exists "admin delete productos" on storage.objects;
create policy "admin delete productos"
  on storage.objects for delete
  using (
    bucket_id = 'productos'
    and exists (select 1 from public.admin_emails a
                where lower(a.email) = lower(auth.jwt() ->> 'email'))
  );
