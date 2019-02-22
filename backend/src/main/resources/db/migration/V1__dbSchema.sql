create table topic (
  id      SERIAL not null primary key,
  name    text   not null,
  text_id text   not null


);

create table twitter_accounts (
  id       SERIAL not null primary key,
  username text   not null

);

create table twitter_hashtags (
  id      SERIAL not null primary key,
  hashtag text   not null

);

create table twitter_words (
  id   SERIAL not null primary key,
  word text   not null

);


create table facebook_pages (
  id      SERIAL not null primary key,
  page_id text   not null

);


create table facebook_groups (
  id       SERIAL not null primary key,
  group_id text   not null

);

create table meetup_locations (
  id       SERIAL not null primary key,
  location text   not null

);

create table reddit_forums (
  id       SERIAL not null primary key,
  forum_id text   not null

);

create table rss_feeds (
  id       SERIAL not null primary key,
  feed_url text   not null

);

