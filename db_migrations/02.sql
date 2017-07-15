CREATE TABLE expenses.expenses
(
    id character varying NOT NULL,
    user_id character varying NOT NULL,
    datetime timestamp without time zone NOT NULL,
    amount numeric NOT NULL,
    description character varying,
    comment character varying,
    CONSTRAINT id PRIMARY KEY (id),
    CONSTRAINT user_id FOREIGN KEY (user_id)
        REFERENCES expenses.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE RESTRICT
)
WITH (
    OIDS = FALSE
);

ALTER TABLE expenses.expenses
    OWNER to expenses_admin;
