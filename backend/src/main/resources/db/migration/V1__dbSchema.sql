create table topic (
                     id      SERIAL not null primary key,
                     name    text   not null,
                     text_id text   not null unique


);

create table source (
  id       SERIAL not null primary key,
  platform text   not null,
  value_type text   not null,
  value text   not null

);

create table training
(
  id       SERIAL    not null primary key,
  model_id text      not null,
  is_done  BOOLEAN   not null,
  start    TIMESTAMP not null,
  "end"    TIMESTAMP,
  accuracy DECIMAL

);

create table "user"
(
  id       SERIAL not null primary key,
  name     text   not null,
  username text   not null unique,
  email    text   not null unique,
  password text   not null
)
