
CREATE TABLE "user" (
  id serial PRIMARY KEY,
  username varchar(64), 
  pwd varchar(64)
);
ALTER SEQUENCE user_id_seq RESTART WITH 100;

CREATE TABLE "project" (
  id serial PRIMARY KEY,
  name varchar(64)
);
ALTER SEQUENCE project_id_seq RESTART WITH 100;