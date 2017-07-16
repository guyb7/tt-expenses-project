--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.3
-- Dumped by pg_dump version 9.6.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: expenses; Type: SCHEMA; Schema: -; Owner: expenses_admin
--

CREATE SCHEMA expenses;


ALTER SCHEMA expenses OWNER TO expenses_admin;

SET search_path = expenses, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: expenses; Type: TABLE; Schema: expenses; Owner: expenses_admin
--

CREATE TABLE expenses (
    id character varying NOT NULL,
    user_id character varying NOT NULL,
    datetime timestamp without time zone NOT NULL,
    amount numeric NOT NULL,
    description character varying,
    comment character varying
);


ALTER TABLE expenses OWNER TO expenses_admin;

--
-- Name: user_sessions; Type: TABLE; Schema: expenses; Owner: expenses_admin
--

CREATE TABLE user_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE user_sessions OWNER TO expenses_admin;

--
-- Name: users; Type: TABLE; Schema: expenses; Owner: expenses_admin
--

CREATE TABLE users (
    id character varying NOT NULL,
    username character varying NOT NULL,
    password character varying NOT NULL,
    name character varying NOT NULL,
    role character varying NOT NULL
);


ALTER TABLE users OWNER TO expenses_admin;

--
-- Name: expenses id; Type: CONSTRAINT; Schema: expenses; Owner: expenses_admin
--

ALTER TABLE ONLY expenses
    ADD CONSTRAINT id PRIMARY KEY (id);


--
-- Name: user_sessions session_pkey; Type: CONSTRAINT; Schema: expenses; Owner: expenses_admin
--

ALTER TABLE ONLY user_sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: users username; Type: CONSTRAINT; Schema: expenses; Owner: expenses_admin
--

ALTER TABLE ONLY users
    ADD CONSTRAINT username UNIQUE (username);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: expenses; Owner: expenses_admin
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_user_time; Type: INDEX; Schema: expenses; Owner: expenses_admin
--

CREATE INDEX idx_user_time ON expenses USING btree (user_id, datetime NULLS FIRST);


--
-- Name: expenses user_id; Type: FK CONSTRAINT; Schema: expenses; Owner: expenses_admin
--

ALTER TABLE ONLY expenses
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

