
CREATE TABLE "user" (
  id serial PRIMARY KEY,
  username varchar(64), 
  pwd varchar(64)
);
ALTER SEQUENCE user_id_seq RESTART WITH 1000;

CREATE TABLE oauth (
  id serial PRIMARY KEY,
  "userId" bigint NOT NULL,
  username varchar(64),
  token varchar(128)
);
ALTER SEQUENCE oauth_id_seq RESTART WITH 1000;


CREATE TABLE "project" (
  id serial PRIMARY KEY,
  name varchar(64), 
  "ghId" bigint,
  "ghName" varchar(64),
  "ghFullName" varchar(128)
);
ALTER SEQUENCE project_id_seq RESTART WITH 1000;


CREATE TABLE "ticket" (
  id serial PRIMARY KEY,
  "projectId" bigint,
  title varchar(128), 
  "ghId" bigint,
  "ghNumber" int,
  "ghTitle" varchar(128)
);
ALTER SEQUENCE ticket_id_seq RESTART WITH 1000;

CREATE TABLE "label" (
  id serial PRIMARY KEY,
  "projectId" bigint,
  name varchar(128), 
  color varchar(32),
  "ghId" bigint,
  "ghColor" varchar(16)
);
ALTER SEQUENCE label_id_seq RESTART WITH 1000;