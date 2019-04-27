create table topic (
  id      SERIAL not null primary key,
  name    text   not null,
  text_id text   not null


);

create table source (
  id       SERIAL not null primary key,
  platform text   not null,
  value_type text   not null,
  value text   not null

);

