-- crypto-analyst : schéma initial
-- Une analyse = un run du pipeline déterministe sur un token donné.

create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Entrée utilisateur
  token_name text not null,
  ticker text not null,
  coingecko_id text,
  token_image text,

  -- Cycle de vie du pipeline
  status text not null default 'pending'
    check (status in ('pending','running','completed','failed')),
  current_step text,
  progress integer not null default 0 check (progress between 0 and 100),
  error text,

  -- Résultats
  methodology_version text,
  global_score numeric,
  verdict text check (verdict in ('privilegier','surveiller','eviter')),
  confidence text check (confidence in ('high','medium','low')),
  pillar_scores jsonb,
  red_flags jsonb,
  metrics jsonb,
  raw_data jsonb,
  report_md text
);

create table public.analysis_events (
  id bigint generated always as identity primary key,
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  created_at timestamptz not null default now(),
  step text not null,
  level text not null default 'info' check (level in ('info','warn','error','success')),
  message text not null
);

create index analysis_events_analysis_idx on public.analysis_events (analysis_id, id);
create index analyses_created_idx on public.analyses (created_at desc);

-- updated_at automatique
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger analyses_updated_at
  before update on public.analyses
  for each row execute function public.set_updated_at();

-- App locale mono-utilisateur : lecture publique (anon), écritures via service role uniquement.
alter table public.analyses enable row level security;
alter table public.analysis_events enable row level security;

create policy "anon_read_analyses" on public.analyses
  for select to anon using (true);
create policy "anon_read_events" on public.analysis_events
  for select to anon using (true);

-- Realtime : progression + flux d'événements
alter publication supabase_realtime add table public.analyses;
alter publication supabase_realtime add table public.analysis_events;
