-- ALPA Creativa — Migración multi-imagen (ejecutar UNA vez en Supabase SQL Editor)
-- Añade image_urls para guardar 2+ fotos por producto. image_url sigue siendo la foto 1
-- para no romper productos antiguos.

alter table public.products
  add column if not exists image_urls text[] not null default '{}';

-- Rellenar image_urls en productos viejos que solo tienen image_url
update public.products
  set image_urls = array[image_url]
  where image_urls = '{}' and image_url <> '';
