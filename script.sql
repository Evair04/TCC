
-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION postgres;

-- public.comp_competicao definition

-- Drop table

-- DROP TABLE public.comp_competicao;

CREATE TABLE public.comp_competicao (
	comp_codigo int4 NOT NULL,
	comp_pista int4 NULL,
	comp_identificador varchar(50) NULL,
	comp_data_cadastro timestamp(0) NULL,
	comp_tempo_inicial timestamp(0) NULL,
	comp_tempo_final timestamp(0) NULL,
	comp_tempo_total interval(6) NULL,
	CONSTRAINT comp_competicao_pkey PRIMARY KEY (comp_codigo)
)
TABLESPACE jornada
;

-- public.usua_usuario definition

-- Drop table

-- DROP TABLE public.usua_usuario;

CREATE TABLE public.usua_usuario (
	usua_codigo int4 NOT NULL,
	usua_login varchar(30) NULL,
	usua_senha varchar(20) NULL,
	usua_data_cadastro timestamp NULL,
	usua_email varchar(100) NULL,
	CONSTRAINT usua_usuario_pkey PRIMARY KEY (usua_codigo)
)
TABLESPACE jornada
;

-- public.s_comp_competicao definition

-- DROP SEQUENCE public.s_comp_competicao;

CREATE SEQUENCE public.s_comp_competicao
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 999999999999
	START 1
	CACHE 1
	NO CYCLE;