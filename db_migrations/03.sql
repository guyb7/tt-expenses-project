CREATE INDEX idx_user_time
    ON expenses.expenses USING btree
    (user_id ASC NULLS LAST, datetime ASC NULLS FIRST)
    TABLESPACE pg_default;
