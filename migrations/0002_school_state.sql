create table if not exists school_state (
  user_id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists school_notification_deliveries (
  user_id text not null,
  alert_id text not null,
  channel text not null check (channel in ('email', 'sms')),
  status text not null check (status in ('sending', 'sent', 'failed', 'skipped')),
  detail text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, alert_id, channel)
);
create index if not exists school_notification_deliveries_user_updated_idx
  on school_notification_deliveries (user_id, updated_at desc);
