--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.3
-- Dumped by pg_dump version 9.6.3

-- Started on 2017-07-13 12:45:18 IDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 8 (class 2615 OID 16396)
-- Name: expenses; Type: SCHEMA; Schema: -; Owner: expenses_admin
--

CREATE SCHEMA expenses;


ALTER SCHEMA expenses OWNER TO expenses_admin;

SET search_path = expenses, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 186 (class 1259 OID 16397)
-- Name: user_sessions; Type: TABLE; Schema: expenses; Owner: expenses_admin
--

CREATE TABLE user_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE user_sessions OWNER TO expenses_admin;

--
-- TOC entry 2268 (class 2606 OID 16404)
-- Name: user_sessions session_pkey; Type: CONSTRAINT; Schema: expenses; Owner: expenses_admin
--

ALTER TABLE ONLY user_sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


-- Completed on 2017-07-13 12:45:18 IDT

--
-- PostgreSQL database dump complete
--

