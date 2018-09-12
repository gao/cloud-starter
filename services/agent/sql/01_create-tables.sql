
CREATE TABLE "user" (
  id bigserial PRIMARY KEY,
  cid bigint, 
  ctime timestamp with time zone,
  type varchar(16) NOT NULL,
  mid bigint, 
  mtime timestamp with time zone,    
  username varchar(64), 
  pwd varchar(64)
);
ALTER SEQUENCE user_id_seq RESTART WITH 1000;



CREATE TABLE oauth (
  id bigserial PRIMARY KEY,
  "userId" bigint NOT NULL,
  username varchar(64),
  token varchar(128)
);
ALTER SEQUENCE oauth_id_seq RESTART WITH 1000;


CREATE TABLE "project" (
  id bigserial PRIMARY KEY,
  cid bigint, 
  ctime timestamp with time zone,
  mid bigint, 
  mtime timestamp with time zone,  
  name varchar(64), 
  "ghId" bigint,
  "ghName" varchar(64),
  "ghFullName" varchar(128)
);
ALTER SEQUENCE project_id_seq RESTART WITH 1000;


CREATE TABLE "user_prole" (
  "userId" bigint NOT NULL,
  "projectId" bigint NOT NULL,
  "name" varchar(32) NOT NULL,
  PRIMARY KEY("userId", "projectId"),
  FOREIGN KEY ("userId") REFERENCES "user" (id) on delete cascade,
  FOREIGN KEY ("projectId") REFERENCES "project" (id) on delete cascade
);


CREATE TABLE "ticket" (
  id bigserial PRIMARY KEY,
  cid bigint, 
  ctime timestamp with time zone,
  mid bigint, 
  mtime timestamp with time zone,
  "projectId" bigint NOT NULL,
  title varchar(128), 
  "ghId" bigint,
  "ghNumber" int,
  "ghTitle" varchar(128)
);
ALTER SEQUENCE ticket_id_seq RESTART WITH 1000;

CREATE TABLE "ticket_label" (
  "ticketId" bigint NOT NULL,
  "labelId" bigint NOT NULL,
  cid bigint, 
  ctime timestamp with time zone,
  mid bigint, 
  mtime timestamp with time zone,    
  PRIMARY KEY("ticketId", "labelId")
);

CREATE TABLE "label" (
  id bigserial PRIMARY KEY,
  cid bigint, 
  ctime timestamp with time zone,
  mid bigint, 
  mtime timestamp with time zone,    
  "projectId" bigint NOT NULL,
  name varchar(128), 
  color varchar(32),
  "ghId" bigint,
  "ghColor" varchar(16)
);
ALTER SEQUENCE label_id_seq RESTART WITH 1000;

CREATE TABLE pane (
  id bigserial PRIMARY KEY,
  cid bigint, 
  ctime timestamp with time zone,
  mid bigint, 
  mtime timestamp with time zone,      
  "projectId" bigint NOT NULL,
  name varchar(128),
  "labelIds" bigint[]
);