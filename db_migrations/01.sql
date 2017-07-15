CREATE TABLE expenses.users
(
    id character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    name character varying NOT NULL,
    role character varying NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT username UNIQUE (username)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE expenses.users
    OWNER to expenses_admin;
