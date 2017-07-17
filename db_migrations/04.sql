ALTER TABLE expenses.users
    ADD COLUMN is_deleted boolean NOT NULL DEFAULT false;

CREATE INDEX idx_not_deleted
    ON expenses.users USING btree
    (is_deleted ASC NULLS LAST)
    TABLESPACE pg_default;
