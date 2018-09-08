INSERT INTO "role" (id, name) VALUES (1, 'admin');
INSERT INTO "role" (id, name) VALUES (2, 'user');

INSERT INTO "user" (id, username, pwd) VALUES (1, 'admin', 'welcome');
INSERT INTO "user_role" ("userId", "roleId") VALUES (1, 1);